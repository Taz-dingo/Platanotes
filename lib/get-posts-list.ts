import { TreeNode } from "@/types/tree";
import { getPostsTree } from "./get-posts-tree";
/*
 * 1. 按类别获取文章：支持根据指定类别从文章树中查找所有相关文件，以便于分类展示。
*/

// 根据类别获取所有相关的文章
export async function getCategoryPosts(category: string): Promise<TreeNode[]> {
    const postsTree = await getPostsTree(); // 获取文章树

    // 递归查找特定类别的文章
    function findCategoryPosts(node: TreeNode, targetCategory: string): TreeNode[] {
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