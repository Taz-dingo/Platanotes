import React from "react";
import moment from "moment";
import "moment/locale/zh-cn";

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
  // 从日期字符串中提取时间戳
  const timestamp = date ? Number(date.split(", ").pop()) : null;
  
  // 使用 moment 格式化日期
  const formattedDate = timestamp
    ? moment(timestamp).format("YYYY年MM月DD日 HH:mm")
    : null;

  return (
    <div
      className={`prose prose-slate dark:prose-invert max-w-none px-4 py-2 ${className}`}
    >
      <header className="mb-8 border-b-2 pb-3">
        <h1 className="mb-2 text-3xl font-bold">{title}</h1>
        {formattedDate && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {formattedDate}
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
