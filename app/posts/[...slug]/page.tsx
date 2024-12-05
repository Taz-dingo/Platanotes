import fs from "fs/promises";
import path from "path";
import Link from "next/link";

import { getPostBySlug } from "@/lib/posts/get-posts-content";
import GlassCard from "@/components/common/glass-card";
import Breadcrumb, { BreadcrumbItem } from "@/components/posts/bread-crumb";
import PostContent from "@/components/posts/post-content";
import ResponsiveASTList from "@/components/sidebar/responsive-ast-list";

interface PageProps {
  params: {
    slug: string[];
  };
}

export default async function Post({ params }: PageProps) {
  const slug = params.slug.join("/");
  const post = await getPostBySlug(slug);

  // 构建 BreadcrumbItems
  const items: BreadcrumbItem[] = params.slug.map((segment, index) => {
    // 第一级（分类）使用 /posts/categories/，其他级别使用 /posts/
    const prefix = index === 0 ? "/posts/categories/" : "/posts/";
    const href = prefix + params.slug.slice(0, index + 1).join("/");
    return {
      label: decodeURIComponent(segment.replace(/-/g, " ")),
      href,
    };
  });

  if (!post) {
    return <div>文章不存在</div>;
  }

  return (
    <article className="flex-1 transition">
      <div className="flex-1">
        <GlassCard className="mb-2">
          <Breadcrumb items={items} />
        </GlassCard>
        <GlassCard>
          <PostContent
            title={post.title}
            date={post.modified || post.created}
            content={post.content}
          />
        </GlassCard>
      </div>
      <ResponsiveASTList headings={post.headings} />
    </article>
  );
}

export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), "public", "static", "posts");
  
  async function getAllMarkdownFiles(dir: string): Promise<string[]> {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
      entries.map(async (entry) => {
        const res = path.resolve(dir, entry.name);
        if (entry.isDirectory()) {
          return getAllMarkdownFiles(res);
        } else if (entry.name.endsWith(".md")) {
          return [res];
        }
        return [];
      })
    );
    
    return files.flat();
  }
  
  try {
    const files = await getAllMarkdownFiles(postsDirectory);
    return files.map(file => ({
      slug: path.relative(postsDirectory, file)
        .replace(/\.md$/, "") // 确保移除 .md 扩展名
        .split(path.sep)
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}
