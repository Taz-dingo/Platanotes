import { getBlogCategories, getCategoryPosts as getCategoryPostsFromOSS, getPostsContent } from './oss';
import matter from 'gray-matter';
import fs from 'fs/promises';
import path from 'path';

export interface StaticPostData {
    type: 'file';
    name: string;
    path: string;
    metadata: {
        ctime: number;
        summary?: string;
        title?: string;
    };
}

export interface CategoryData {
    slug: string;
    posts: StaticPostData[];
}

// 处理文章内容，提取摘要等信息
function processPostContent(content: string, fileName: string, relativePath: string): StaticPostData {
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

    return {
        type: 'file',
        name: fileName,
        path: relativePath,
        metadata: {
            ctime: frontMatter.date ? new Date(frontMatter.date).getTime() : Date.now(),
            summary,
            title: frontMatter.title || fileName
        }
    };
}

// 生成所有分类的静态数据
export async function generateAllCategoryData(): Promise<CategoryData[]> {
    const categories = await getBlogCategories();
    const allCategoryData: CategoryData[] = [];

    for (const category of categories) {
        const categorySlug = category.replace('Blog/', '').replace('/', '');
        const posts = await getCategoryPostsFromOSS(categorySlug);
        
        if (posts.length === 0) continue;

        // 批量获取所有文章内容
        const contentMap = await getPostsContent(posts);
        const categoryPosts: StaticPostData[] = [];

        for (const post of posts) {
            const content = contentMap.get(post);
            if (!content) continue;

            const fileName = post.split('/').pop()?.replace('.md', '') || '';
            const relativePath = post.replace('Blog/', '').replace('.md', '');
            
            categoryPosts.push(processPostContent(content, fileName, relativePath));
        }

        // 按时间排序
        categoryPosts.sort((a, b) => (b.metadata.ctime - a.metadata.ctime));

        allCategoryData.push({
            slug: categorySlug,
            posts: categoryPosts
        });
    }

    return allCategoryData;
}

// 在构建时生成静态数据文件
export async function generateStaticDataFile() {
    console.log('Starting to generate static data...');
    const data = await generateAllCategoryData();
    console.log(`Generated data for ${data.length} categories`);
    
    try {
        // 确保目录存在
        const staticDir = path.join(process.cwd(), 'public', 'static-data');
        await fs.mkdir(staticDir, { recursive: true });
        
        // 写入静态数据文件
        const filePath = path.join(staticDir, 'category-data.json');
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        console.log(`Static data written to ${filePath}`);
    } catch (error) {
        console.error('Error writing static data:', error);
        throw error;
    }
}
