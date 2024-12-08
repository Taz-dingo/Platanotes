import fs from "fs/promises";
import path from "path";
import { Suspense } from "react";

import { POSTS_PER_PAGE } from "@/lib/config/constants";
import {
  getCategoryPosts,
  getSortedFileList,
} from "@/lib/posts/get-posts-list";
import PostList from "@/components/posts/post-list";
import StaticPostSkeleton from "@/components/posts/static-post-skeleton";
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

function SuspenseFallback() {
  return (
    <div className="flex flex-col [&>*]:opacity-0 [&>*]:animate-fade-in [&>*]:fill-mode-forwards">
      {[...Array(3)].map((_, index) => (
        <div key={index} style={{ animationDelay: `${index * 100}ms` }}>
          <StaticPostSkeleton />
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
          <div className="opacity-0 animate-fade-in fill-mode-forwards">
            <PostListWrapper slug={slug} />
          </div>
        </Suspense>
      </div>
      <ResponsiveASTList />
    </div>
  );
}
