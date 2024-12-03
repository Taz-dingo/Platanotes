"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// usePortal Hook
// 思路：
// 1. 创建一个可以将子组件渲染到指定 DOM 节点的 Portal
// 2. 使用 ref 和 state 来跟踪目标 DOM 节点和挂载状态
// 3. 提供一个 Portal 组件，用于实际渲染子组件到目标节点

// 参数：
// selector: 用于选择目标 DOM 节点的选择器字符串

// 返回：
// - mounted: 布尔值，表示 Portal 是否已挂载
// - Portal: 组件，用于渲染子组件到目标节点

export function usePortal(selector: string) {
  // 存储目标 DOM 节点的引用
  const ref = useRef<Element | null>(null);
  // 跟踪 Portal 是否已挂载
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 在组件挂载后查找目标节点并更新状态
    ref.current = document.querySelector(selector);
    setMounted(true);
  }, [selector]);

  return {
    Portal: ({ children }: { children: React.ReactNode }) => {
      return mounted && ref.current
        ? createPortal(children, ref.current)
        : null;
    },
    targetRef: ref,
  };
}
