import { getPostsTree } from "@/lib/posts";
import React from "react";
import PostTree from "@/components/post-tree";

export default async function PostListBar() {
  const postsTree = await getPostsTree();

  return (
    <div className="bg-[rgba(255,255,255,0.5)] p-5 rounded-lg">
      <h2 className="border-b-2 border-solid border-slate-300 mb-2">
        文章目录
      </h2>
      <PostTree node={postsTree} />
    </div>
  );
}
