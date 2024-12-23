import { useEffect, useState } from "react";

import PostTreeNode, { TreeNode } from "@/components/common/post-tree-node";

interface ASTListCardProps {
  headings: { level: number; text: string }[];
}

// 将标题列表转换为树形结构
export function convertHeadingsToTree(
  headings: { level: number; text: string }[]
): TreeNode {
  const root: TreeNode = {
    id: "root",
    label: "目录",
    children: [],
  };

  const stack: { node: TreeNode; level: number }[] = [{ node: root, level: 0 }];

  headings.forEach((heading, index) => {
    const node: TreeNode = {
      id: `heading-${heading.text}-${index}`,
      label: heading.text,
      children: [],
    };

    // 找到合适的父节点：回溯到第一个层级小于当前标题的节点
    while (stack.length > 1 && stack[stack.length - 1].level >= heading.level) {
      stack.pop();
    }

    // 添加到父节点的子节点中
    const parent = stack[stack.length - 1].node;
    parent.children = parent.children || [];
    parent.children.push(node);

    // 将当前节点加入栈中
    stack.push({ node, level: heading.level });
  });

  return root;
}

export default function ArticleTOC({ headings }: ASTListCardProps) {
  const [activeHeading, setActiveHeading] = useState<string>("");

  useEffect(() => {
    // 为每个标题添加唯一ID
    const headingElements = document
      .querySelector(".markdown-body")
      ?.querySelectorAll("h1, h2, h3, h4, h5, h6");
    headingElements?.forEach((el, index) => {
      if (el.id === "") {
        const text = el.textContent?.trim() || "";
        el.id = `heading-${text}-${index}`;
      }
    });

    // 创建 Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-5px 0px -80% 0px",
      }
    );

    // 观察所有标题元素
    headingElements?.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, []);

  if (!headings || headings.length === 0) {
    return null;
  }

  const treeData = convertHeadingsToTree(headings);

  return (
    <>
      <div className="leading-loose">
        {treeData.children && treeData.children.length > 0 ? (
          <PostTreeNode
            node={treeData}
            showToggleIcon={false}
            defaultExpand={true}
            clickToExpand={false}
            isSelected={(node) => {
              const match = String(node.id).match(/heading-(.*)-(\d+)$/);
              if (!match) return false;
              return activeHeading === `heading-${match[1]}-${match[2]}`;
            }}
            onNodeClick={(node) => {
              const text = typeof node.label === "string" ? node.label : "";
              if (!text) return;

              const match = String(node.id).match(/heading-(.*)-(\d+)$/);
              if (!match) return;

              const decodedText = decodeURIComponent(match[1]);
              const index = parseInt(match[2], 10);

              const headingElements = document
                .querySelector(".markdown-body")
                ?.querySelectorAll("h1, h2, h3, h4, h5, h6");
              const targetElement = Array.from(headingElements || []).find(
                (h, idx) =>
                  h.textContent?.trim() === decodedText && idx === index
              );

              if (targetElement) {
                targetElement.scrollIntoView({ behavior: "smooth" });
                setActiveHeading(targetElement.id);
              }
            }}
          />
        ) : (
          <p>暂无标题</p>
        )}
      </div>
    </>
  );
}
