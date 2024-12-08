import React from "react";

export default function StaticPostSkeleton() {
  return (
    <div
      className="group relative mb-3 overflow-hidden rounded-lg bg-[rgba(255,255,255,0.3)] p-8 shadow-sm backdrop-blur-sm transition-opacity duration-500"
      data-skeleton
    >
      <div className="animate-pulse opacity-60">
        {/* 标题骨架 */}
        <div className="mb-1 h-7 w-3/4 rounded bg-gray-200" />
        
        {/* 内容骨架 - 3行 */}
        <div className="mt-4 space-y-3">
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-11/12 rounded bg-gray-200" />
          <div className="h-4 w-4/5 rounded bg-gray-200" />
        </div>
        
        {/* 日期骨架 */}
        <div className="mt-4 flex gap-4">
          <div className="h-4 w-24 rounded bg-gray-200" />
          <div className="h-4 w-32 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
} 