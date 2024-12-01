import matter from 'gray-matter';
import { CategoryData } from './generate-static-data';

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
        ctime: number;
        summary?: string;
        title?: string;
    }; // 元数据
}

// 从静态数据文件获取文章树结构
export async function getPostsTree(): Promise<FileTreeNode> {
    try {
        // 从静态数据文件中读取
        const staticData = await import('../public/static-data/category-data.json') as { default: CategoryData[] };
        const rootChildren: FileTreeNode[] = [];

        for (const category of staticData.default) {
            rootChildren.push({
                type: 'directory',
                name: category.slug,
                path: category.slug,
                children: category.posts as FileTreeNode[]
            });
        }

        return {
            type: 'directory',
            name: 'Blog',
            path: '',
            children: rootChildren
        };
    } catch (error) {
        console.error('Error loading static data:', error);
        // 如果静态数据加载失败，返回空树
        return {
            type: 'directory',
            name: 'Blog',
            path: '',
            children: []
        };
    }
}

// 获取文件树
export async function getFileTree(): Promise<FileTreeNode> {
    return getPostsTree();
}
