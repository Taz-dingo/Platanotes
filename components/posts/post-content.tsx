import React from "react";
import moment from "moment";

import "moment/locale/zh-cn";
import { Calendar, Clock } from "lucide-react";

interface PostContentProps {
  title: string;
  date?: string;
  created_timestamp?: number;
  modified_timestamp?: number;
  content: string;
  className?: string;
}

export default function PostContent({
  title,
  date,
  created_timestamp,
  modified_timestamp,
  content,
  className = "",
}: PostContentProps) {
  // 从日期字符串中提取时间戳
  const timestamp = date ? Number(date.split(", ").pop()) : null;

  // 使用 moment 格式化日期
  const createdDate = created_timestamp
    ? moment(created_timestamp).format("YYYY年MM月DD日")
    : null;
  const modifiedDate = modified_timestamp
    ? moment(modified_timestamp).format("YYYY年MM月DD日")
    : null;

  return (
    <div
      className={`prose prose-slate dark:prose-invert max-w-none px-4 py-2 ${className}`}
    >
      <header className="mb-8 border-b-2 pb-3">
        <h1 className="mb-2 text-3xl font-bold">{title}</h1>
        <div>
          {createdDate && (
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>创建于 {createdDate}</span>
            </div>
          )}
          {modifiedDate && modifiedDate !== createdDate && (
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>修改于 {modifiedDate}</span>
            </div>
          )}
          
        </div>
      </header>
      <div
        className="markdown-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
