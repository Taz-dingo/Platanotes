import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { unified } from "unified";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype"
import { ASTNode } from '@/types/tree';
import { getPostsTree, postsDirectory } from './get-posts-tree';

/*
 * 1. 获取文章内容：根据给定的 slug，从文件系统中读取对应的 Markdown 文件，并解析其内容和元数据。
 *    使用 unified 处理 Markdown，将其转换为 HTML，同时支持 GitHub 风格的 Markdown 和数学公式。
 * 
 * 2. 按类别获取文章：支持根据指定类别从文章树中查找所有相关文件，以便于分类展示。
*/

let treeData: ASTNode;
// 自定义插件，获取HTML语法树
const getHAST = () => (tree: any) => {
    treeData = tree;// 保存到treeData变量上
};

export const getTreeData = () => {
    if (!treeData) {

    }
    return treeData;
}

// 根据 slug 获取特定文章内容
export async function getPostBySlug(slug: string) {
    const fullPath = path.join(postsDirectory, decodeURIComponent(`${slug}.md`)); // 生成文件路径
    const dirPath = path.join(postsDirectory, slug); // 生成目录路径

    try {
        await fs.access(fullPath); // 检查文件是否存在
        // 读取文件内容
        const fileContents = await fs.readFile(fullPath, 'utf8');
        const { data, content } = matter(fileContents); // 解析元数据和内容

        // 使用 unified 处理 markdown 内容并转化为 HTML
        // remark解析markdown，rehype解析html
        const processedContent = await unified()
            .use(remarkParse) // markdown -> mdast
            .use(remarkGfm) // 支持 GitHub 风格的 markdown
            .use(remarkMath) // 支持数学公式
            .use(remarkRehype) // mdast -> hast
            .use(getHAST) // 获取HTML语法树
            .use(rehypeKatex) // 处理 LaTeX
            .use(rehypeHighlight) // 代码高亮
            .use(rehypeStringify) // hast -> HTML
            .process(content);

        const contentHtml = `<div class="markdown-body">${processedContent.toString()}</div>`; // 将处理后的内容包裹在 div 中

        return {
            slug,
            content: contentHtml, // 返回处理后的内容
            ...data, // 合并元数据
        };
    } catch (error) {
        try {
            const stats = await fs.stat(dirPath); // 检查路径是否为目录
            if (stats.isDirectory()) {
                return null; // 返回 null 表示这是一个目录
            }
        } catch {
            return undefined; // 返回 undefined 表示既不是文件也不是目录
        }
    }
}

