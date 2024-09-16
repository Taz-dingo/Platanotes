import { getPostsTree } from "../lib/posts";
import PostTree from "../components/post-tree";

export default async function Home() {
  const postsTree = await getPostsTree();

  return (
    <main className="container mx-auto px-4">
      <h1 className="text-4xl font-bold mb-6">梧桐树下</h1>
      <p className="text-lg mb-8">享受片刻宁静</p>
    </main>
  );
}
