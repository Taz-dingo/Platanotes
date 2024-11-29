import matter from 'gray-matter';
import { unified } from "unified";
import type { Root } from 'hast';
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { getHAST } from './get-hast';
import { getPostContent } from './oss';
import { safeUrlDecode } from './url-utils';

// AST 节点类型
export interface ASTNode {
    type: 'root' | 'text' | 'element';
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
    type: 'text';
    value: string;
}

export interface ElementNode extends ASTNode {
    type: 'element';
    tagName: string;
    properties?: Record<string, any>;
    children?: ASTNode[];
}

export interface RootNode extends ASTNode {
    type: 'root';
    children: ASTNode[];
}

// 根据 slug 获取特定文章内容
export async function getPostBySlug(slug: string) {
    try {
        // 构建OSS路径，确保正确解码
        const ossPath = `Blog/${safeUrlDecode(slug)}.md`;
        
        // 从OSS获取文件内容
        const fileContents = await getPostContent(ossPath);
        const { data, content } = matter(fileContents);

        // 使用 unified 处理 markdown 内容并转化为 HTML
        const processedContent = await unified()
            .use(remarkParse)
            .use(remarkGfm)
            .use(remarkMath)
            .use(remarkRehype, { allowDangerousHtml: true })
            .use(getHAST)
            .use(rehypeKatex)
            .use(rehypeHighlight)
            .use(rehypeStringify)
            .process(content);

        const contentHtml = `<div class="markdown-body">${String(processedContent)}</div>`;

        return {
            slug,
            content: contentHtml,
            ...data,
        };
    } catch (error) {
        console.error('Error loading post from OSS:', error);
        return undefined;
    }
}