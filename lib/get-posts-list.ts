import { DIRECTORY_NAMES } from "./constants";
import matter from 'gray-matter';
import { getBlogCategories, getCategoryPosts as getCategoryPostsFromOSS, getPostContent } from './oss';

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
    const posts = await getCategoryPostsFromOSS(category);
    const categoryPosts: FileTreeNode[] = [];

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

            categoryPosts.push({
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

    // 按时间排序
    return categoryPosts.sort((a, b) => (b.metadata?.ctime || 0) - (a.metadata?.ctime || 0));
}

export interface FileTreeNode {
    type: 'file' | 'directory';
    name: string;
    path: string;
    children?: FileTreeNode[];
    metadata?: {
        ctime: number;
        summary?: string;
        title?: string;
    };
}

// 获取所有文章列表，按时间排序
export async function getSortedFileList(): Promise<FileTreeNode[]> {
    const categories = await getBlogCategories();
    const allPosts: FileTreeNode[] = [];

    for (const category of categories) {
        const categoryName = category.replace('Blog/', '').replace('/', '');
        const posts = await getCategoryPostsFromOSS(categoryName);
        
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

                allPosts.push({
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
    }

    // 按时间排序
    return allPosts.sort((a, b) => (b.metadata?.ctime || 0) - (a.metadata?.ctime || 0));
}