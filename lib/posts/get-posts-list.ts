import { DIRECTORY_NAMES } from "@/lib/config/constants";
import { Post } from '@/lib/posts/get-posts-tree';
import { CategoryData } from '@/lib/utils/generate-static-data';

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
export async function getCategoryPosts(category: string): Promise<Post[]> {
    try {
        const staticData = await import('@/public/static-data/category-data.json') as { default: CategoryData[] };
        const categoryData = staticData.default.find(c => c.slug === category);
        return categoryData?.posts || [];
    } catch (error) {
        console.error('Error loading static data:', error);
        return [];
    }
}

// 获取所有文章列表，按时间排序
export async function getSortedFileList(page?: number, limit?: number): Promise<Post[]> {
    try {
        const staticData = await import('@/public/static-data/category-data.json') as { default: CategoryData[] };
        const allPosts: Post[] = [];
        
        for (const category of staticData.default) {
            allPosts.push(...(category.posts as Post[]));
        }

        const sortedPosts = allPosts.sort((a, b) => (b.metadata?.ctime || 0) - (a.metadata?.ctime || 0));

        if (page && limit) {
            const start = (page - 1) * limit;
            const end = start + limit;
            return sortedPosts.slice(start, end);
        }

        return sortedPosts;
    } catch (error) {
        console.error('Error loading static data:', error);
        return [];
    }
}