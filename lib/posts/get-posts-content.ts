import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import { safeUrlDecode } from "@/lib/utils/url-utils";

// AST 节点类型
export interface ASTNode {
  type: "root" | "text" | "element";
  tagName?: string;
  properties?: Record<string, any>;
  value?: string;
  position?: {
    start: { line: number; column: number; offset: number };
    end: { line: number; column: number; offset: number };
  };
  children?: ASTNode[];
}

// 特殊节点类型
export interface TextNode extends ASTNode {
  type: "text";
  value: string;
}

export interface ElementNode extends ASTNode {
  type: "element";
  tagName: string;
  properties?: Record<string, any>;
  children?: ASTNode[];
}

export interface RootNode extends ASTNode {
  type: "root";
  children: ASTNode[];
}

// 文章数据类型
export interface PostData {
  slug: string;
  content: string;
  headings: { level: number; text: string }[];
  title: string;
  created?: string;
  modified?: string;
  created_timestamp?: number;
  modified_timestamp?: number;
}

// 根据 slug 获取特定文章内容
export async function getPostBySlug(
  slug: string
): Promise<PostData | undefined> {
  try {
    // 构建本地文件路径，确保只有一个 .md 扩展名
    const postsDirectory = path.join(process.cwd(), "public", "static", "posts");
    const slugWithoutExt = slug.replace(/\.md$/, ""); // 移除可能存在的 .md 扩展名
    const fullPath = path.join(postsDirectory, `${safeUrlDecode(slugWithoutExt)}.md`);

    // 从本地文件系统读取内容
    const fileContents = await fs.readFile(fullPath, "utf8");
    const { data: frontMatter, content } = matter(fileContents);

    // 提取标题结构
    const headings: { level: number; text: string }[] = [];
    const lines = content.split("\n");
    let inCodeBlock = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // 检查是否进入或离开代码块
      if (line.trim().startsWith("```")) {
        inCodeBlock = !inCodeBlock;
        continue;
      }

      // 只在非代码块区域处理标题
      if (!inCodeBlock && line.startsWith("#")) {
        const level = line.match(/^#+/)?.[0].length || 0;
        const text = line.replace(/^#+\s+/, "").trim();
        if (level > 0 && text) {
          headings.push({ level, text });
        }
      }
    }

    // 使用 unified 处理 markdown 内容并转化为 HTML
    const processedContent = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkMath)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeKatex)
      .use(rehypeHighlight)
      .use(rehypeStringify, { allowDangerousHtml: true })
      .process(content);

    // 获取文件名作为标题（不包含日期前缀和扩展名）
    const fileName = path.basename(fullPath)
      .replace(/^\d{4}\.\d{2}\.\d{2}\s+/, "")
      .replace(/\.md$/, "");

    // 从 frontMatter 中获取时间信息
    const created = frontMatter.created;
    const modified = frontMatter.modified;
    const created_timestamp = created ? Number(created.split(", ").pop()) : 0;
    const modified_timestamp = modified ? Number(modified.split(", ").pop()) : 0;

    return {
      slug,
      content: `<div class="markdown-body">${String(processedContent)}</div>`,
      headings,
      title: fileName,
      created,
      modified,
      created_timestamp,
      modified_timestamp,
    };
  } catch (error) {
    console.error("Error loading post:", error);
    return undefined;
  }
}
