"use client";

import React, { useState } from "react";
import Link from "next/link";

interface TreeNode {
  name: string;
  path: string;
  type: "file" | "directory";
  children?: TreeNode[];
  metadata?: any;
}

interface PostTreeProps {
  node: TreeNode;
  level?: number;
}

const PostTree: React.FC<PostTreeProps> = ({ node, level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(level === 0);

  if (level === 0 && node.children) {
    return (
      <ul className="pl-0 list-none">
        {node.children.map((child, index) => (
          <PostTree
            key={index}
            node={child}
            level={1}
          />
        ))}
      </ul>
    );
  }

  if (node.type === "file") {
    return (
      <li style={{ paddingLeft: `${level * 8}px` }}>
        <Link
          href={`/posts/${node.path}`}
          className="hover:underline"
        >
          {node.name}
        </Link>
      </li>
    );
  }

  return (
    <li style={{ paddingLeft: `${level * 8}px` }}>
      <span
        onClick={() => setIsExpanded(!isExpanded)}
        className="cursor-pointer hover:text-blue-500"
      >
        {isExpanded ? "▼" : "▶"} {node.name}
      </span>
      {isExpanded && node.children && (
        <ul className="list-none pl-0">
          {node.children.map((child, index) => (
            <PostTree
              key={index}
              node={child}
              level={level + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export default PostTree;
