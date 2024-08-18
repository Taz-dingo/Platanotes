import Link from "next/link";

// 补充定义
type Post = {
  slug: string;
  title: string;
};

type PostListProps = {
  posts: Post[];
};

export const PostList = ({ posts }: PostListProps) => (
  <ul className="space-y-4">
    {posts.map((post) => (
      <li key={post.slug}>
        <Link href={`/${post.slug}`}>{post.slug.split("/")[1]}</Link>
        <span className="ml-2 text-gray-500">({post.slug.split("/")[0]})</span>
      </li>
    ))}
  </ul>
);
