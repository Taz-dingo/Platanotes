import React from "react";

export default function PostContentSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      {/* 标题区域 */}
      <div className="space-y-4 border-b border-gray-200 pb-8">
        <div className="h-8 w-3/4 rounded bg-gray-200" />
        <div className="flex gap-4">
          <div className="h-4 w-32 rounded bg-gray-200" />
          <div className="h-4 w-40 rounded bg-gray-200" />
        </div>
      </div>

      {/* 文章内容区域 */}
      <div className="space-y-6">
        {/* 段落1 */}
        <div className="space-y-3">
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-11/12 rounded bg-gray-200" />
          <div className="h-4 w-4/5 rounded bg-gray-200" />
        </div>

        {/* 段落2 */}
        <div className="space-y-3">
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-10/12 rounded bg-gray-200" />
          <div className="h-4 w-3/4 rounded bg-gray-200" />
        </div>

        {/* 子标题 */}
        <div className="h-6 w-1/3 rounded bg-gray-200" />

        {/* 段落3 */}
        <div className="space-y-3">
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-11/12 rounded bg-gray-200" />
          <div className="h-4 w-4/5 rounded bg-gray-200" />
        </div>

        {/* 代码块 */}
        <div className="h-32 rounded bg-gray-200" />

        {/* 段落4 */}
        <div className="space-y-3">
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-10/12 rounded bg-gray-200" />
          <div className="h-4 w-3/4 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
} 