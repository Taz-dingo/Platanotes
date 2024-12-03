import React from "react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

interface PostContentProps {
  title: string;
  date?: string;
  content: string;
  className?: string;
}

export default function PostContent({
  title,
  date,
  content,
  className = "",
}: PostContentProps) {
  return (
    <div
      className={`prose prose-slate dark:prose-invert max-w-none px-4 py-2 ${className}`}
    >
      <header className="mb-8 border-b-2 pb-3">
        <h1 className="mb-2 text-3xl font-bold">{title}</h1>
        {date && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {format(new Date(date), "yyyy年MM月dd日", { locale: zhCN })}
          </div>
        )}
      </header>
      <div
        className="markdown-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
