import { getPostsTree } from "../lib/posts";
import PostTree from "../components/post-tree";

export default async function Home() {
  const postsTree = await getPostsTree();

  return (
    <div>
      <h1>博客文章</h1>
      <ul>
        <PostTree node={postsTree} />
      </ul>
    </div>
  );
}
