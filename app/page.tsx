import { PostList } from "@/components/post-list";
import { getAllPosts } from "@/lib/posts";
import Image from "next/image";

export default function Home() {
  const posts = getAllPosts();
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">Latest Posts</h2>
      <PostList posts={posts} />
    </>
  );
}
