"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

// 通用树节点接口
export interface TreeNode {
  id: string | number;
  label: React.ReactNode;
  children?: TreeNode[];
  data?: any; // 可选的额外数据
}

interface TreeProps {
  node: TreeNode;
  level?: number;
  onNodeClick?: (node: TreeNode) => void;
  isSelected?: (node: TreeNode) => boolean;
  renderLabel?: (node: TreeNode, isLeaf: boolean) => React.ReactNode;
  indentSize?: number;
  showToggleIcon?: boolean; // 控制是否显示展开图标
  defaultExpand?: boolean; // 控制是否默认展开所有节点
}

const PostTreeNode: React.FC<TreeProps> = ({
  node,
  level = 0,
  onNodeClick,
  isSelected,
  renderLabel,
  indentSize = 8,
  showToggleIcon = true,
  defaultExpand = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpand || level === 0);
  const [contentHeight, setContentHeight] = useState<string>("auto");
  const childrenRef = useRef<HTMLUListElement>(null);
  const isLeaf = !node.children || node.children.length === 0;

  useEffect(() => {
    if (childrenRef.current) {
      if (isExpanded) {
        const resizeObserver = new ResizeObserver(() => {
          setContentHeight(`${childrenRef.current?.scrollHeight || 0}px`);
        });
        resizeObserver.observe(childrenRef.current);
        return () => resizeObserver.disconnect();
      } else {
        setContentHeight("0px");
      }
    }
  }, [isExpanded]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLeaf) {
      setIsExpanded((prev) => !prev);
    }
    onNodeClick?.(node);
  };

  // 根节点特殊处理，直接渲染子节点
  if (level === 0 && node.children) {
    return (
      <ul className="pl-0 list-none">
        {node.children.map((child) => (
          <PostTreeNode
            key={child.id}
            node={child}
            level={1}
            onNodeClick={onNodeClick}
            isSelected={isSelected}
            renderLabel={renderLabel}
            indentSize={indentSize}
            showToggleIcon={showToggleIcon}
            defaultExpand={defaultExpand}
          />
        ))}
      </ul>
    );
  }

  // 渲染节点标签
  const renderDefaultLabel = () => (
    <div className="flex items-center gap-2">
      {!isLeaf && showToggleIcon && (
        <Image
          src="/svg/triangle.svg"
          alt="展开/折叠"
          width={20}
          height={20}
          className={`mr-1 transition-transform duration-200 ease-in-out ${
            isExpanded ? "" : "rotate-[-90deg]"
          }`}
        />
      )}
      <span>{node.label}</span>
    </div>
  );

  return (
    <li style={{ paddingLeft: `${level * indentSize}px` }}>
      <div
        onClick={handleClick}
        className={`
          py-2 px-2 rounded-lg cursor-pointer
          transition-colors duration-200
          hover:bg-gray-100
          ${isSelected?.(node) ? "text-green-600 bg-gray-100" : ""}
        `}
      >
        {renderLabel ? renderLabel(node, isLeaf) : renderDefaultLabel()}
      </div>

      {!isLeaf && (
        <div
          className="overflow-hidden transition-opacity duration-200 "
          style={{ maxHeight: contentHeight }}
        >
          <ul
            ref={childrenRef}
            className="list-none pl-0"
          >
            {node.children?.map((child) => (
              <PostTreeNode
                key={child.id}
                node={child}
                level={level + 1}
                onNodeClick={onNodeClick}
                isSelected={isSelected}
                renderLabel={renderLabel}
                indentSize={indentSize}
                showToggleIcon={showToggleIcon}
                defaultExpand={defaultExpand}
              />
            ))}
          </ul>
        </div>
      )}
    </li>
  );
};

export default PostTreeNode;
