import { POSTS_PER_PAGE } from "@/lib/config/constants";
import { getSortedFileList } from "@/lib/posts/get-posts-list";
import PostList from "@/components/posts/post-list";
import ResponsiveASTList from "@/components/sidebar/responsive-ast-list";

export default async function Posts() {
  const initialPosts = await getSortedFileList(1, POSTS_PER_PAGE);

  return (
    <div className="flex-1">
      <PostList initialPosts={initialPosts} />
      <ResponsiveASTList />
    </div>
  );
}
