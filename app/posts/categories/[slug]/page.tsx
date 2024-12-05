import fs from "fs/promises";
import path from "path";
import Link from "next/link";

import { POSTS_PER_PAGE } from "@/lib/config/constants";
import { getSortedFileList, getCategoryPosts } from "@/lib/posts/get-posts-list";
import PostList from "@/components/posts/post-list";
import ResponsiveASTList from "@/components/sidebar/responsive-ast-list";

interface PageProps {
  params: {
    slug: string;
  };
}

// 生成静态页面参数
export async function generateStaticParams() {
  const postsDir = path.join(process.cwd(), "public", "static", "posts");
  const categories = new Set<string>();

  try {
    const files = await fs.readdir(postsDir, { recursive: true });
    for (const file of files) {
      if (typeof file === "string" && file.endsWith(".md")) {
        const category = file.split(path.sep)[0];
        if (category) categories.add(category);
      }
    }
  } catch (error) {
    console.error("Error reading posts directory:", error);
  }

  return [
    { slug: "all" },
    ...Array.from(categories).map((category) => ({
      slug: category,
    })),
  ];
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = params;

  try {
    let posts;
    if (slug === "all") {
      posts = await getSortedFileList();
    } else {
      posts = await getCategoryPosts(slug);
    }

    // 只获取第一页的帖子
    const initialPosts = posts.slice(0, POSTS_PER_PAGE);

    return (
      <div className="flex-1">
        <PostList initialPosts={initialPosts} />
        <ResponsiveASTList />
      </div>
    );
  } catch (error) {
    console.error("Error reading posts:", error);
    return (
      <div className="flex-1">
        <p>Error loading posts.</p>
      </div>
    );
  }
}
