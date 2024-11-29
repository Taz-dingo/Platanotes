"use client"; // 使其成为客户端组件

import { useRouter } from "next/navigation";
import PostTreeNode, { TreeNode } from "./post-tree-node";
import { useState } from "react";

const PostTreeWithClickHandler = ({ root }: any) => {
  const router = useRouter();
  const [selectedNode, setSelectedNode] = useState<TreeNode>();

  // 定义点击节点后的跳转函数
  const handleNodeClick = (node: TreeNode) => {
    if (!node.children) {
      router.push(`/posts/${node.id}`);
      setSelectedNode(node);
    } // 假设你要跳转到对应的文章页面
  };

  const isSelected = (node: TreeNode) => node === selectedNode;

  return (
    <PostTreeNode
      node={root}
      onNodeClick={handleNodeClick}
      isSelected={isSelected}
    />
  );
};

export default PostTreeWithClickHandler;
