"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { safeUrlEncode } from "@/lib/utils/url-utils";

import Tooltip from "./tooltip";

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

  const handleNodeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (clickToExpand) {
      setIsExpanded(!isExpanded);
    }
    if (onNodeClick) {
      // 确保节点数据在传递给点击处理函数之前进行URL编码
      const encodedNode = {
        ...node,
        id: typeof node.id === "string" ? safeUrlEncode(node.id) : node.id,
      };
      onNodeClick(encodedNode);
    }
  };

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLeaf) {
      setIsExpanded(!isExpanded);
    }
  };

  const renderToggleIcon = () => {
    return (
      <div
        className="flex h-4 w-4 flex-shrink-0 items-center justify-center"
        onClick={handleToggleClick}
      >
        {isLeaf || !showToggleIcon ? null : (
          <Image
            src="/svg/triangle.svg"
            alt={isExpanded ? "展开" : "收起"}
            width={16}
            height={16}
            className={`transition ${isExpanded ? "" : "rotate-[-90deg]"}`}
          />
        )}
      </div>
    );
  };

  // 根节点特殊处理，直接渲染子节点
  if (level === 0 && node.children) {
    return (
      <ul className="list-none pl-0">
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
        className={`flex cursor-pointer items-center hover:text-green-700 ${
          isSelected?.(node) ? "text-green-700" : ""
        }`}
        onClick={handleNodeClick}
      >
        {level > 0 && (
          <div
            className="absolute bottom-0 left-0 top-0 border-gray-300"
            style={{ left: `${(level - 1) * indentSize + 4}px` }}
          />
        )}
        {renderToggleIcon()}
        <Tooltip
          content={typeof node.label === "string" ? node.label : ""}
          position="right"
          delay={300}
        >
          <div className="overflow-hidden text-ellipsis whitespace-nowrap">
            {renderLabel ? renderLabel(node, isLeaf) : node.label}
          </div>
        </Tooltip>
      </div>
      {!isLeaf && (
        <ul
          ref={childrenRef}
          className="list-none overflow-hidden border-l transition-all duration-300 ease-in-out"
          style={{ height: contentHeight }}
        >
          {node.children?.map((child, index) => (
            <PostTreeNode
              key={child.id || index}
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
          ))}
        </ul>
      )}
    </li>
  );
};

export default PostTreeNode;
