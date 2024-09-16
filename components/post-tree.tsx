'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface TreeNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: TreeNode[];
  metadata?: any;
}

interface PostTreeProps {
  node: TreeNode;
}

const PostTree: React.FC<PostTreeProps> = ({ node }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (node.type === 'file') {
    return (
      <li>
        <Link href={`/posts/${node.path}`}>
          {node.name}
        </Link>
      </li>
    );
  }

  return (
    <li>
      <span onClick={() => setIsExpanded(!isExpanded)} style={{ cursor: 'pointer' }}>
        {isExpanded ? '▼' : '▶'} {node.name}
      </span>
      {isExpanded && node.children && (
        <ul>
          {node.children.map((child, index) => (
            <PostTree key={index} node={child} />
          ))}
        </ul>
      )}
    </li>
  );
};

export default PostTree;