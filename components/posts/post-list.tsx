'use client';

import { Post } from '@/lib/posts/get-posts-tree';
import GlassCard from '@/components/common/glass-card';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { POSTS_PER_PAGE } from '@/lib/config/constants';

interface PostListProps {
  initialPosts: Post[];
}

export default function PostList({ initialPosts }: PostListProps) {
  const params = useParams();
  const category = typeof params?.slug === 'string' ? params.slug : undefined;
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  const loadMorePosts = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const url = new URL('/api/posts', window.location.origin);
      if (category) {
        url.searchParams.set('category', category);
      }
      url.searchParams.set('page', String(currentPage + 1));
      url.searchParams.set('limit', String(POSTS_PER_PAGE));

      const response = await fetch(url);
      const data = await response.json();
      
      if (data.posts.length > 0) {
        setPosts(prev => [...prev, ...data.posts]);
        setCurrentPage(prev => prev + 1);
      }
      setHasMore(data.hasMore);
    } catch (error) {
      console.error('Error loading more posts:', error);
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
      {posts.map((node) => {
        const date = new Date(node.metadata?.ctime || 0).toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        return (
          <GlassCard
            className="mb-3 p-8 opacity-0 animate-fade-in"
            hover
            key={node.path}
          >
            <Link
              className="group"
              href={`/posts/${node.path}`}
            >
              <h2 className="group-hover:text-green-700 transition duration-300 border-b-2 border-gray-300 pb-1 mb-1 text-xl font-bold">
                {node.metadata?.title || node.name}
              </h2>
              <p className="text-gray-600 break-all">{node.metadata?.summary}</p>
            </Link>
            <p className="text-sm text-gray-500 mt-2">{date}</p>
          </GlassCard>
        );
      })}
      {hasMore && (
        <div ref={loaderRef} className="flex justify-center p-4">
          <div className="w-6 h-6 border-t-2 border-green-700 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
