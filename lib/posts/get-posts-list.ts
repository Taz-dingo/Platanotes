import { DIRECTORY_NAMES } from "@/lib/utils/constants";
import { FileTreeNode } from '@/lib/posts/get-posts-tree';
import { CategoryData } from '@/lib/generate-static-data';

// 使用 LRU 缓存来存储分类文章列表
const categoryCache = new Map<string, { data: FileTreeNode[], timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存

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
    // 检查缓存
    const cached = categoryCache.get(category);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }

    try {
        const staticData = await import('@/public/static-data/category-data.json') as { default: CategoryData[] };
        const categoryData = staticData.default.find(c => c.slug === category);
        const posts = categoryData?.posts || [];
        
        // 转换为 FileTreeNode 类型
        const categoryPosts = posts.map(post => post as FileTreeNode);
        
        // 更新缓存
        categoryCache.set(category, { data: categoryPosts, timestamp: Date.now() });
        
        return categoryPosts;
    } catch (error) {
        console.error('Error loading static data:', error);
        return [];
    }
}

// 获取所有文章列表，按时间排序
export async function getSortedFileList(): Promise<FileTreeNode[]> {
    try {
        const staticData = await import('@/public/static-data/category-data.json') as { default: CategoryData[] };
        const allPosts: FileTreeNode[] = [];
        
        for (const category of staticData.default) {
            allPosts.push(...(category.posts as FileTreeNode[]));
        }

        return allPosts.sort((a, b) => (b.metadata?.ctime || 0) - (a.metadata?.ctime || 0));
    } catch (error) {
        console.error('Error loading static data:', error);
        return [];
    }
}