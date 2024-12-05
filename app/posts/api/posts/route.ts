import { NextRequest, NextResponse } from "next/server";

import { POSTS_PER_PAGE } from "@/lib/config/constants";
import { getSortedFileList, getCategoryPosts } from "@/lib/posts/get-posts-list";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || String(POSTS_PER_PAGE));

  try {
    let posts;
    let totalPosts;

    // 如果是 all 或没有指定分类，则获取所有文章
    if (!category || category === "all") {
      totalPosts = await getSortedFileList();
      posts = await getSortedFileList(page, limit);
    } else {
      // 获取指定分类的文章
      totalPosts = await getCategoryPosts(category);
      posts = totalPosts.slice((page - 1) * limit, page * limit);
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
