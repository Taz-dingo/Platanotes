import { getFileTree, getPostsTree } from "@/lib/get-posts-tree";
import React from "react";
import PostTreeNode, { TreeNode } from "@/components/sidebar/post-tree-node";
import { ASTNode, getTreeData } from "@/lib/get-posts-content";

export default async function ASTListBar() {
  // 获取
  const originRoot = getTreeData();

  function convertASTToTree(ast: ASTNode): TreeNode {
    const root: TreeNode = {
      id: 0, // 根节点的 ID，可以根据需要自定义
      label: "Root", // 根节点的标签，可以根据需要自定义
      children: [],
    };

    const stack: { node: TreeNode; level: number }[] = []; // 用于跟踪当前节点

    const traverse = (node: ASTNode) => {
      if (
        node.type === "element" &&
        node.tagName &&
        /^h[1-6]$/.test(node.tagName)
      ) {
        const level = parseInt(node.tagName[1], 10);
        const treeNode: TreeNode = {
          id: root.children!.length + 1, // 根据需要生成唯一 ID
          label: node.children?.map((child) => child.value).join("") || "",
          children: [],
        };

        // 将新节点加入到树中
        while (stack.length && stack[stack.length - 1].level >= level) {
          stack.pop();
        }
        if (stack.length) {
          // 如果有父节点，将新节点添加为子节点
          stack[stack.length - 1].node.children?.push(treeNode);
        } else {
          // 如果没有父节点，将新节点添加为根节点的子节点
          root.children?.push(treeNode);
        }

        // 记录当前节点和级别
        stack.push({ node: treeNode, level });
      }

      // 递归遍历子节点
      if (node.children) {
        node.children.forEach(traverse);
      }
    };

    traverse(ast);

    // 返回根节点
    return root;
  }

  const root = convertASTToTree(originRoot);

  return (
    <div className="bg-[rgba(255,255,255,0.5)] p-5 rounded-lg sticky top-2 shadow-lg">
      <h2 className="border-b-2 border-solid border-slate-300 mb-2 pb-2 font-semibold">
        内容目录
      </h2>
      <div className="leading-loose">
        {root.children?.length || 0 > 0 ? (
          <PostTreeNode
            node={root}
            showToggleIcon={false}
            defaultExpand={true}
          />
        ) : (
          <p>暂无标题~</p>
        )}
      </div>
    </div>
  );
}
