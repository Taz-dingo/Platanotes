"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 可以在这里添加错误日志上报
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <h2 className="mb-4 text-4xl font-bold">出错了</h2>
      <p className="mb-6 text-gray-600">抱歉，发生了一些错误。</p>
      <button
        onClick={reset}
        className="rounded-lg bg-green-600 px-6 py-3 text-white transition-colors hover:bg-green-700"
      >
        重试
      </button>
    </div>
  );
}
