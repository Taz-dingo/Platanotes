import { getPostsTree } from "@/lib/posts";
import React from "react";
import PostTreeNode from "@/components/sidebar/post-tree-node";

export default async function PostListBar() {
  const postsTree = await getPostsTree();

  return (
    <div className="bg-[rgba(255,255,255,0.5)] p-5 rounded-lg sticky top-2">
      <h2 className="border-b-2 border-solid border-slate-300 mb-2 pb-2 font-semibold">
        文章目录
      </h2>
      <div className="leading-loose">
        <PostTreeNode node={postsTree} />
      </div> 
    </div>
  );
}
