import { getSortedFileList } from "@/lib/posts/get-posts-list";
import PostList from "@/components/posts/post-list";
import { POSTS_PER_PAGE } from "@/lib/config/constants";

export default async function Home() {
  const allPosts = await getSortedFileList();
  const initialPosts = allPosts.slice(0, POSTS_PER_PAGE);

  return <PostList initialPosts={initialPosts} />;
}
