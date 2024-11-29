import matter from 'gray-matter';
import { getBlogCategories, getCategoryPosts, getPostContent } from './oss';

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

// 从OSS获取文章树结构
export async function getPostsTree(): Promise<FileTreeNode> {
    const categories = await getBlogCategories();
    const rootChildren: FileTreeNode[] = [];

    for (const category of categories) {
        const categoryName = category.replace('Blog/', '').replace('/', '');
        const posts = await getCategoryPosts(categoryName);
        const categoryChildren: FileTreeNode[] = [];

        for (const post of posts) {
            try {
                const content = await getPostContent(post);
                const { data: frontMatter, content: markdownContent } = matter(content);

                // 提取摘要
                let summary = frontMatter.summary;
                if (!summary) {
                    const plainText = markdownContent
                        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
                        .replace(/[#*`>+-=\[\]]/g, '')
                        .replace(/\n+/g, ' ')
                        .trim();
                    summary = plainText.length > 100 
                        ? plainText.substring(0, 100) + '...'
                        : plainText;
                }

                const fileName = post.split('/').pop()?.replace('.md', '') || '';
                const relativePath = post.replace('Blog/', '').replace('.md', '');

                categoryChildren.push({
                    type: 'file',
                    name: fileName,
                    path: relativePath,
                    metadata: {
                        ctime: frontMatter.date ? new Date(frontMatter.date).getTime() : Date.now(),
                        summary,
                        title: frontMatter.title || fileName
                    }
                });
            } catch (error) {
                console.error(`Error processing file ${post}:`, error);
            }
        }

        // 添加分类目录节点
        rootChildren.push({
            type: 'directory',
            name: categoryName,
            path: categoryName,
            children: categoryChildren
        });
    }

    // 返回根节点
    return {
        type: 'directory',
        name: 'Blog',
        path: '',
        children: rootChildren
    };
}

// 获取文件树
export async function getFileTree(): Promise<FileTreeNode> {
    return getPostsTree();
}
