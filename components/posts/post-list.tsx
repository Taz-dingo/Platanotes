"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Calendar, Clock } from "lucide-react";
import moment from "moment";

import { POSTS_PER_PAGE } from "@/lib/config/constants";
import { Post } from "@/lib/posts/get-posts-list";
import GlassCard from "@/components/common/glass-card";

interface PostListProps {
  initialPosts: Post[];
}

export default function PostList({ initialPosts }: PostListProps) {
  const params = useParams();
  const category = typeof params?.slug === "string" ? params.slug : undefined;
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  const loadMorePosts = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const url = new URL("/posts/api/posts", window.location.origin);
      if (category) {
        url.searchParams.set("category", category);
      }
      url.searchParams.set("page", String(currentPage + 1));
      url.searchParams.set("limit", String(POSTS_PER_PAGE));

      const response = await fetch(url);
      const data = await response.json();

      if (data.posts.length > 0) {
        setPosts((prev) => [...prev, ...data.posts]);
        setCurrentPage((prev) => prev + 1);
      }
      setHasMore(data.hasMore);
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !isLoading) {
          loadMorePosts();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading]);

  return (
    <div className="flex flex-col">
      {posts.map((post) => {
        // 获取创建时间和修改时间
        const createdDate = post.metadata?.created
          ? moment(post.metadata.created_timestamp).format("YYYY-MM-DD")
          : null;
        const modifiedDate = post.metadata?.modified
          ? moment(post.metadata.modified_timestamp).format("YYYY-MM-DD")
          : null;

        // 获取文章摘要
        const summary =
          post.content
            .replace(/^---[\s\S]*?---/, "") // 移除 frontmatter
            .replace(/\[.*?\]/g, "") // 移除链接文本
            .replace(/\(.*?\)/g, "") // 移除链接地址
            .replace(/#+\s+.*$/gm, "") // 移除标题
            .replace(/\n/g, " ") // 替换换行为空格
            .trim()
            .slice(0, 200) + "..."; // 截取前200个字符

        return (
          <GlassCard className="mb-3 p-8" hover key={post.path}>
            <Link className="group" href={`/posts/${post.path}`}>
              <h2 className="mb-1 border-b-2 border-gray-300 pb-1 text-xl transition duration-300 group-hover:text-green-700 dark:text-gray-200">
                {post.metadata?.title}
              </h2>
              <p className="break-all text-gray-600 dark:text-gray-300">
                {summary}
              </p>
            </Link>
            <div className="mt-2 flex flex-wrap gap-3 text-sm dark:text-gray-400">
              {createdDate && (
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{createdDate}</span>
                </div>
              )}
              {modifiedDate && modifiedDate !== createdDate && (
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>修改于 {modifiedDate}</span>
                </div>
              )}
            </div>
          </GlassCard>
        );
      })}
      {hasMore && (
        <div ref={loaderRef} className="flex justify-center p-4">
          <div className="h-6 w-6 animate-spin rounded-full border-t-2 border-green-700"></div>
        </div>
      )}
    </div>
  );
}
