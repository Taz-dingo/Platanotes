import fs from "fs/promises";
import path from "path";
import { Suspense } from "react";

import { POSTS_PER_PAGE } from "@/lib/config/constants";
import {
  getCategoryPosts,
  getSortedFileList,
} from "@/lib/posts/get-posts-list";
import PostList from "@/components/posts/post-list";
import ResponsiveASTList from "@/components/sidebar/responsive-ast-list";

interface PageProps {
  params: {
    slug: string;
  };
}

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

async function PostListWrapper({ slug }: { slug: string }) {
  let posts;
  if (slug === "all") {
    posts = await getSortedFileList();
  } else {
    posts = await getCategoryPosts(slug);
  }

  const initialPosts = posts.slice(0, POSTS_PER_PAGE);
  return <PostList initialPosts={initialPosts} />;
}

function PostListSkeleton() {
  return (
    <div
      className="dark:bg-card-dark group relative mb-3 overflow-hidden rounded-lg bg-[rgba(255,255,255,0.3)] p-8 shadow-sm backdrop-blur-sm transition-opacity duration-500"
      data-skeleton
    >
      <div className="animate-pulse opacity-60">
        {/* 标题骨架 */}
        <div className="mb-1 h-7 w-3/4 rounded bg-gray-200" />

        {/* 内容骨架 - 3行 */}
        <div className="mt-4 space-y-3">
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-11/12 rounded bg-gray-200" />
          <div className="h-4 w-4/5 rounded bg-gray-200" />
        </div>

        {/* 日期骨架 */}
        <div className="mt-4 flex gap-4">
          <div className="h-4 w-24 rounded bg-gray-200" />
          <div className="h-4 w-32 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

function SuspenseFallback() {
  return (
    <div className="[&>*]:fill-mode-forwards flex flex-col [&>*]:animate-fade-in [&>*]:opacity-0">
      {[...Array(3)].map((_, index) => (
        <div key={index} style={{ animationDelay: `${index * 100}ms` }}>
          <PostListSkeleton />
        </div>
      ))}
    </div>
  );
}

export default function CategoryPage({ params }: PageProps) {
  const { slug } = params;

  return (
    <div className="flex-1">
      <div className="relative">
        <Suspense fallback={<SuspenseFallback />}>
          <div className="fill-mode-forwards animate-fade-in opacity-0">
            <PostListWrapper slug={slug} />
          </div>
        </Suspense>
      </div>
      <ResponsiveASTList />
    </div>
  );
}
