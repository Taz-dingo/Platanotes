import { CategoryData } from '@/lib/utils/generate-static-data';

/**
 * 博客文章数据结构定义和相关操作
 */

// 博客文章类型
export interface Post {
    type: 'file' | 'directory'; // 类型（文件或目录）
    name: string; // 文章名称
    path: string; // 文章路径
    children?: Post[]; // 子文章（如果是目录）
    metadata?: {
        ctime: number;
        summary?: string;
        title?: string;
    }; // 文章元数据
}

// 从静态数据文件获取文章树结构
export async function getPostsTree(): Promise<Post> {
    try {
        // 从静态数据文件中读取
        const staticData = await import('@/public/static-data/category-data.json') as { default: CategoryData[] };
        const rootChildren: Post[] = [];

        for (const category of staticData.default) {
            rootChildren.push({
                type: 'directory',
                name: category.slug,
                path: category.slug,
                children: category.posts as Post[]
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
export async function getFileTree(): Promise<Post> {
    return getPostsTree();
}
