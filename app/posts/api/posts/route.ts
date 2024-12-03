import { NextRequest, NextResponse } from "next/server";

import { POSTS_PER_PAGE } from "@/lib/config/constants";
import { getSortedFileList } from "@/lib/posts/get-posts-list";
import { generateAllCategoryData } from "@/lib/utils/generate-static-data";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || String(POSTS_PER_PAGE));

  try {
    let posts;
    let totalPosts;

    // 如果没有指定分类，则获取所有文章（首页场景）
    if (!category) {
      totalPosts = await getSortedFileList();
      posts = await getSortedFileList(page, limit);
    } else {
      // 获取指定分类的文章（分类页场景）
      const categories = await generateAllCategoryData();
      const categoryData = categories.find((c) => c.slug === category);
      if (!categoryData) {
        return NextResponse.json({ posts: [], hasMore: false });
      }
      totalPosts = categoryData.posts;
      posts = categoryData.posts.slice((page - 1) * limit, page * limit);
    }

    const hasMore = page * limit < totalPosts.length;

    return NextResponse.json({
      posts,
      hasMore,
      total: totalPosts.length,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
