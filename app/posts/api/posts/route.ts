import { NextRequest, NextResponse } from 'next/server';
import { generateAllCategoryData } from '@/lib/utils/generate-static-data';
import { POSTS_PER_PAGE } from '@/lib/config/constants';
import { getSortedFileList } from '@/lib/posts/get-posts-list';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || String(POSTS_PER_PAGE));

  try {
    let posts;
    // 如果没有指定分类，则获取所有文章（首页场景）
    if (!category) {
      posts = await getSortedFileList();
    } else {
      // 获取指定分类的文章（分类页场景）
      const categories = await generateAllCategoryData();
      const categoryData = categories.find(c => c.slug === category);
      if (!categoryData) {
        return NextResponse.json({ posts: [], hasMore: false });
      }
      posts = categoryData.posts;
    }

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedPosts = posts.slice(start, end);
    const hasMore = end < posts.length;

    return NextResponse.json({
      posts: paginatedPosts,
      hasMore,
      total: posts.length
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}
