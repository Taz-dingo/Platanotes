import { FileTreeNode, getFileTree, getPostsTree } from "@/lib/get-posts-tree";
import React from "react";
import PostTreeNode, { TreeNode } from "@/components/sidebar/post-tree-node";

import PostTreeWithClickHandler from "./post-tree-with-click-handler";

export default async function PostListBar() {
  const originRoot = await getFileTree();

  function convertFileTreeNodeToTreeNode(fileNode: FileTreeNode): TreeNode {
    return {
      id: fileNode.path, // 使用路径作为节点 ID
      label: fileNode.name, // 使用名称作为节点标签
      children: fileNode.children
        ? fileNode.children.map(convertFileTreeNodeToTreeNode)
        : undefined,
      data: fileNode.metadata, // 可选的额外数据
    };
  }

  const root = convertFileTreeNodeToTreeNode(originRoot);

  return (
    <div className="bg-[rgba(255,255,255,0.5)] p-5 rounded-lg sticky top-2 shadow-lg">
      <h2 className="border-b-2 border-solid border-slate-300 mb-2 pb-2 font-semibold">
        文章目录
      </h2>
      <div className="leading-loose max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        <PostTreeWithClickHandler root={root} />
      </div>
    </div>
  );
}
