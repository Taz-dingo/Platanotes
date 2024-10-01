import { getPostsTree } from "@/lib/posts";
import React from "react";
import PostTreeNode from "@/components/post-tree-node";

export default async function PostListBar() {
  const postsTree = await getPostsTree();

  return (
    <div className="bg-[rgba(255,255,255,0.5)] p-5 rounded-lg">
      <h2 className="border-b-2 border-solid border-slate-300 mb-2">
        文章目录
      </h2>
      <PostTreeNode node={postsTree} />
    </div>
  );
}
