import fs from 'fs/promises';
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
    const nodes = await Promise.all(entries.map(async entry => {
        const res = path.resolve(dir, entry.name); // 获取完整路径
        const currentPath = path.join(basePath, entry.name); // 当前条目的相对路径

        if (entry.isDirectory()) {
            // 如果是目录，递归获取其子目录
            return {
                name: entry.name,
                path: currentPath,
                type: 'directory' as const,
                children: await getPostsTreeRecursively(res, currentPath)
            };
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
            // 如果是 markdown 文件，读取文件内容
            try {
                // 获取frontmatter
                const fileContent = await fs.readFile(res, 'utf8');
                const fm = matter(fileContent);

                // 获取创建时间，处理没有 created 字段的情况
                const created = fm.data.created;
                if (!created) {
                    console.warn(`Missing 'created' field in frontmatter for file: ${res}`);
                }
                const ctime = created ? Number(created.split(',').pop().trim()) : 0;

                // 取摘要
                const content = fm.content
                const cleanContents = content
                    .replace(/[#*`>+-=]/g, "")
                    .trim()
                const summary = cleanContents.length === 0
                    ? "还没有内容噢~"
                    : cleanContents.substring(0, 100) + '. . . . . .';

                return {
                    name: entry.name.replace(/\.md$/, ''), // 去掉文件扩展名
                    path: currentPath.replace(/\.md$/, ''), // 去掉路径中的文件扩展名
                    type: 'file' as const,
                    metadata: {
                        ctime,
                        summary
                    }  // 存储元数据
                };
            } catch (error) {
                console.error(`Error reading file ${res}:`, error); // 错误处理
                return {
                    name: entry.name,
                    path: currentPath,
                    type: 'file' as const,
                    metadata: {}
                };
            }
        } else {
            // 对于其他文件类型
            return {
                name: entry.name,
                path: currentPath,
                type: 'file' as const,
                metadata: {}
            };
        }
    }));

    return nodes; // 返回构建的节点数组
}

// 获取所有文章的树结构
export async function getPostsTree(): Promise<FileTreeNode> {
    return {
        name: 'posts',
        path: '',
        type: 'directory',
        children: await getPostsTreeRecursively(postsDirectory) // 调用递归函数
    };
}


