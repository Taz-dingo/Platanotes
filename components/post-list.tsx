import React from 'react';
import Link from 'next/link';

interface Post {
  name: string;
  path: string;
  type: 'file' | 'directory';
  metadata?: any;
}

interface PostListProps {
  posts: Post[];
}

export const PostList: React.FC<PostListProps> = ({ posts }) => {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.path}>
          <Link href={`/${post.path}`}>
            {post.name}
          </Link>
          <span className="ml-2 text-gray-500">({post.path})</span>
        </li>
      ))}
    </ul>
  );
};
