'use client';

import { convertHeadingsToTree, TreeNode } from './post-tree-node';
import PostTreeNode from './post-tree-node';

interface ASTListBarProps {
  headings: { level: number; text: string }[];
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
