import { promises as fs } from 'fs';
import matter from 'gray-matter';
import path from 'path';

/**
 * 1. 文章树结构：通过递归读取指定目录下的文件和子目录，构建一个树形结构（TreeNode），
 *    其中每个节点包含文件或目录的名称、路径、类型和元数据。
 */

// 文件树节点类型
export interface FileTreeNode {
    type: 'file' | 'directory'; // 节点类型
    name: string; // 节点名称
    path: string; // 节点路径
    children?: FileTreeNode[]; // 子节点
    metadata?: {
        ctime?: number;
        summary?: string;
        title?: string;
    }; // 元数据
}

// 定义文章存储目录
export const postsPath = '/public/posts/'
export const postsDirectory = path.join(process.cwd(), postsPath);

let fileTreeCache: FileTreeNode | null = null;

// 缓存结果
export async function getFileTree() {
    if (!fileTreeCache) {
        fileTreeCache = await getPostsTree();
    }
    return fileTreeCache;
}

// 递归获取指定目录下的所有文章及其子目录                                
async function getPostsTreeRecursively(dir: string, basePath: string = ''): Promise<FileTreeNode[]> {
    // 读取目录中的所有条目
    const entries = await fs.readdir(dir, { withFileTypes: true });

    // 使用 Promise.all 处理所有条目
    const nodes = await Promise.all(entries.map(async (entry): Promise<FileTreeNode | null> => {
        const res = path.resolve(dir, entry.name); // 获取完整路径
        const currentPath = path.join(basePath, entry.name); // 当前条目的相对路径

        if (entry.isDirectory()) {
            // 如果是目录，递归获取其子目录
            const children = await getPostsTreeRecursively(res, currentPath);
            return {
                type: 'directory' as const,
                name: entry.name,
                path: currentPath,
                children
            };
        } else if (entry.name.endsWith('.md')) {
            // 如果是 markdown 文件
            try {
                const stats = await fs.stat(res);
                const content = await fs.readFile(res, 'utf-8');
                const { data: frontMatter, content: markdownContent } = matter(content);

                // 提取摘要：首先尝试使用 frontMatter 中的 summary，如果没有则从内容中提取
                let summary = frontMatter.summary;
                if (!summary) {
                    // 移除 Markdown 标记并提取前 100 个字符作为摘要
                    const plainText = markdownContent
                        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 处理链接 [text](url) -> text
                        .replace(/[#*`>+-=\[\]]/g, '') // 移除特殊字符
                        .replace(/\n+/g, ' ') // 将换行替换为空格
                        .trim();
                    summary = plainText.length > 100 
                        ? plainText.substring(0, 100) + '...'
                        : plainText;
                }

                // 移除 .md 后缀
                const nameWithoutExt = entry.name.replace(/\.md$/, '');
                const pathWithoutExt = currentPath.replace(/\.md$/, '');

                return {
                    type: 'file' as const,
                    name: nameWithoutExt,
                    path: pathWithoutExt,
                    metadata: {
                        ctime: stats.ctimeMs,
                        summary,
                        title: frontMatter.title || nameWithoutExt
                    }
                };
            } catch (error) {
                console.error(`Error processing file ${res}:`, error);
                return {
                    type: 'file' as const,
                    name: entry.name.replace(/\.md$/, ''),
                    path: currentPath.replace(/\.md$/, ''),
                    metadata: {
                        ctime: 0,
                        summary: '无法加载文章内容'
                    }
                };
            }
        }
        // 忽略非 markdown 文件
        return null;
    }));


    return nodes.filter((node): node is FileTreeNode => node !== null);
}

// 获取所有文章的树结构
export async function getPostsTree(): Promise<FileTreeNode> {
    const children = await getPostsTreeRecursively(postsDirectory);
    return {
        type: 'directory',
        name: 'posts',
        path: '',
        children
    };
}
