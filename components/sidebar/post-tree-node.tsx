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
  clickToExpand?: boolean; // 控制是否点击节点时展开/收起
}

const PostTreeNode: React.FC<TreeProps> = ({
  node,
  level = 0,
  onNodeClick,
  isSelected,
  renderLabel,
  indentSize = 8,
  showToggleIcon = false, // 默认不显示展开图标
  defaultExpand = false,
  clickToExpand = false,
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
    if (!isLeaf && clickToExpand) {
      setIsExpanded(!isExpanded);
    }
    onNodeClick?.(node);
  };

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLeaf) {
      setIsExpanded(!isExpanded);
    }
  };

  const renderToggleIcon = () => {
    if (isLeaf || !showToggleIcon) return null;

    return (
      <span
        className="cursor-pointer inline-block w-4 h-4 mr-1"
        onClick={handleToggleClick}
      >
        <Image
          src="/svg/triangle.svg"
          alt={isExpanded ? "收起" : "展开"}
          width={16}
          height={16}
          className={`transition-transform duration-200 ${
            isExpanded ? "rotate-0" : "-rotate-90"
          }`}
        />
      </span>
    );
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
            clickToExpand={clickToExpand}
          />
        ))}
      </ul>
    );
  }

  return (
    <li style={{ paddingLeft: `${level * indentSize}px` }}>
      <div
        className={`flex items-center cursor-pointer hover:text-green-500 ${
          isSelected?.(node) ? "text-green-500" : ""
        }`}
        onClick={handleClick}
      >
        {renderToggleIcon()}
        {renderLabel ? (
          renderLabel(node, isLeaf)
        ) : (
          <span>{node.label}</span>
        )}
      </div>
      {!isLeaf && (
        <ul
          ref={childrenRef}
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{ height: contentHeight }}
        >
          {node.children?.map((child, index) => (
            <li key={child.id || index}>
              <PostTreeNode
                node={child}
                level={level + 1}
                onNodeClick={onNodeClick}
                isSelected={isSelected}
                renderLabel={renderLabel}
                indentSize={indentSize}
                showToggleIcon={showToggleIcon}
                defaultExpand={defaultExpand}
                clickToExpand={clickToExpand}
              />
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default PostTreeNode;
