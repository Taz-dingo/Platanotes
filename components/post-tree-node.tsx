"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

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

const PostTreeNode: React.FC<PostTreeProps> = ({ node, level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(level === 0);
  const [childrenExpanded, setChildrenExpanded] = useState(false);
  const [height, setHeight] = useState<string>("auto");
  const childrenRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (childrenRef.current) {
      if (isExpanded) {
        const resizeObserver = new ResizeObserver(() => {
          setHeight(`${childrenRef.current?.scrollHeight || 0}px`);
        });
        resizeObserver.observe(childrenRef.current);
        return () => resizeObserver.disconnect();
      } else {
        setHeight("0px");
      }
    }
  }, [isExpanded, childrenExpanded]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setChildrenExpanded(true);
    }
  };

  if (level === 0 && node.children) {
    return (
      <ul className="pl-0 list-none">
        {node.children.map((child, index) => (
          <PostTreeNode
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
          className="hover:text-green-600"
        >
          {node.name}
        </Link>
      </li>
    );
  }

  return (
    <li style={{ paddingLeft: `${level * 8}px` }}>
      <span
        onClick={handleToggle}
        className="cursor-pointer hover:text-green-600 flex items-center"
      >
        <Image
          src="/svg/triangle.svg"
          alt="展开/折叠"
          width={20}
          height={20}
          className={`mr-1 transition-transform duration-200 ease-in-out ${
            isExpanded ? "" : "rotate-[-90deg]"
          }`}
        />
        {node.name}
      </span>
      {node.children && (
        <div
          className="overflow-hidden transition-all duration-200 ease-in-out"
          style={{ maxHeight: height, opacity: isExpanded ? 1 : 0 }}
        >
          <ul
            ref={childrenRef}
            className="list-none pl-0"
          >
            {node.children.map((child, index) => (
              <PostTreeNode
                key={index}
                node={child}
                level={level + 1}
              />
            ))}
          </ul>
        </div>
      )}
    </li>
  );
};

export default PostTreeNode;
