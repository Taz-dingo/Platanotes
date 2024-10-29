import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { FileTreeNode } from '@/types/tree';

/**
 * 1. 文章树结构：通过递归读取指定目录下的文件和子目录，构建一个树形结构（TreeNode），
 *    其中每个节点包含文件或目录的名称、路径、类型和元数据。
 */


// 定义文章存储目录
export const postsDirectory = path.join(process.cwd(), '/public/posts');

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
                const fileContents = await fs.readFile(res, 'utf8');
                const { data } = matter(fileContents); // 解析文件元数据
                return {
                    name: entry.name.replace(/\.md$/, ''), // 去掉文件扩展名
                    path: currentPath.replace(/\.md$/, ''), // 去掉路径中的文件扩展名
                    type: 'file' as const,
                    metadata: data // 存储元数据
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


