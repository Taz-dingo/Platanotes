'use client';

import PostTreeNode, { TreeNode } from '@/components/common/post-tree-node';

interface ASTListBarProps {
  headings: { level: number; text: string }[];
}

// 将标题列表转换为树形结构
export function convertHeadingsToTree(headings: { level: number; text: string }[]): TreeNode {
  const root: TreeNode = {
    id: 'root',
    label: '目录',
    children: [],
  };

  const stack: { node: TreeNode; level: number }[] = [{ node: root, level: 0 }];

  headings.forEach((heading, index) => {
    const node: TreeNode = {
      id: `heading-${index}`,
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

export default function ASTListBar({ headings }: ASTListBarProps) {
  if (!headings || headings.length === 0) {
    return null;
  }

  const treeData = convertHeadingsToTree(headings);

  return (
    <div className="bg-[rgba(255,255,255,0.5)] p-5 rounded-lg sticky top-2 shadow-md">
      <h2 className="border-b-2 border-solid border-slate-300 mb-2 pb-2 font-semibold">
        内容目录
      </h2>
      <div className="leading-loose">
          {treeData.children && treeData.children.length > 0 ? (
            <PostTreeNode
              node={treeData}
              showToggleIcon={false}
              defaultExpand={true}
              clickToExpand={false}
              onNodeClick={(node) => {
                // 点击标题时滚动到对应位置的逻辑
                const text = typeof node.label === 'string' ? node.label : '';
                if (text) {
                  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
                  const target = Array.from(headings).find(
                    (h) => h.textContent?.trim() === text
                  );
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                  }
                }
              }}
            />
          ) : (
            <p>暂无标题</p>
          )}
      </div>
    </div>
  );
}
