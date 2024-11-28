import { FileTreeNode, getFileTree, getPostsTree, postsDirectory } from "./get-posts-tree";
import { DIRECTORY_NAMES } from "./constants";

// 获取目录的展示名称
export async function getDirectoryDisplayName(dirName: string): Promise<string> {
    const key = dirName.toLowerCase() as keyof typeof DIRECTORY_NAMES;
    return DIRECTORY_NAMES[key]?.zh || dirName;
}

// 获取目录的系统名称
export async function getDirectorySystemName(displayName: string): Promise<string> {
    const entry = Object.entries(DIRECTORY_NAMES).find(
        ([_, value]) => value.zh === displayName
    );
    return entry ? entry[0] : displayName;
}

// 根据类别获取所有相关的文章
export async function getCategoryPosts(category: string): Promise<FileTreeNode[]> {
    const postsTree = await getPostsTree();

    // 递归查找特定类别的文章
    function findCategoryPosts(node: FileTreeNode, targetCategory: string): FileTreeNode[] {
        if (node.type === 'directory' && node.name === targetCategory) {
            return node.children?.filter(child => child.type === 'file') || [];
        }
        if (node.type === 'directory') {
            return node.children?.flatMap(child => findCategoryPosts(child, targetCategory)) || [];
        }
        return [];
    }

    return findCategoryPosts(postsTree, category);
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
        return order === 'desc' ? -comparison : comparison;
    });
}