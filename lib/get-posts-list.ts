import { FileTreeNode, getFileTree, getPostsTree, postsDirectory } from "./get-posts-tree";
/*
 * 1. 按类别获取文章：支持根据指定类别从文章树中查找所有相关文件，以便于分类展示。
*/

// 根据类别获取所有相关的文章
export async function getCategoryPosts(category: string): Promise<FileTreeNode[]> {
    const postsTree = await getPostsTree(); // 获取文章树

    // 递归查找特定类别的文章
    function findCategoryPosts(node: FileTreeNode, targetCategory: string): FileTreeNode[] {
        if (node.type === 'file' && node.path.startsWith(targetCategory)) {
            return [node]; // 如果是目标类别的文件，返回该节点
        }
        if (node.type === 'directory') {
            // 递归查找子节点
            return node.children?.flatMap(child => findCategoryPosts(child, targetCategory)) || [];
        }
        return []; // 返回空数组
    }

    return findCategoryPosts(postsTree, category); // 返回找到的文章
}

export type FileItem = Omit<FileTreeNode, "children">
// 处理文件树，获取排序列表
async function processFileTree(node: FileTreeNode): Promise<FileItem[]> {
    let fileList: FileItem[] = [];

    // 如果是文件，则获取创建时间并加入列表
    if (node.type === 'file') {
        fileList.push(node);
    }

    // 如果是目录，则递归处理子节点
    if (node.type === 'directory' && node.children) {
        for (const child of node.children) {
            const childFiles = await processFileTree(child);
            fileList = fileList.concat(childFiles);
        }
    }

    return fileList;
}

// 根据创建时间排序
export async function getSortedFileList(order: 'asc' | 'desc' = 'desc'): Promise<FileItem[]> {
    const root = await getFileTree();
    const fileList = await processFileTree(root);
    return fileList.sort((a, b) => {
        const comparison = (a.metadata?.ctime || 0) - (b.metadata?.ctime || 0);
        return order === 'asc' ? comparison : -comparison;
    });
}