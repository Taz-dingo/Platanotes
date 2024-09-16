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

const postsDirectory = path.join(process.cwd(), 'posts');

interface TreeNode {
    name: string;
    path: string;
    type: 'file' | 'directory';
    children?: TreeNode[];
    metadata?: any;
}

async function getPostsTreeRecursively(dir: string, basePath: string = ''): Promise<TreeNode[]> {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    const nodes = await Promise.all(entries.map(async entry => {
        const res = path.resolve(dir, entry.name);
        const currentPath = path.join(basePath, entry.name);

        if (entry.isDirectory()) {
            return {
                name: entry.name,
                path: currentPath,
                type: 'directory' as const,
                children: await getPostsTreeRecursively(res, currentPath)
            };
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
            try {
                const fileContents = await fs.readFile(res, 'utf8');
                const { data } = matter(fileContents);
                return {
                    name: entry.name.replace(/\.md$/, ''),
                    path: currentPath.replace(/\.md$/, ''),
                    type: 'file' as const,
                    metadata: data
                };
            } catch (error) {
                console.error(`Error reading file ${res}:`, error);
                return {
                    name: entry.name,
                    path: currentPath,
                    type: 'file' as const,
                    metadata: {}
                };
            }
        } else {
            return {
                name: entry.name,
                path: currentPath,
                type: 'file' as const,
                metadata: {}
            };
        }
    }));

    return nodes;
}

export async function getPostsTree(): Promise<TreeNode> {
    return {
        name: 'posts',
        path: '',
        type: 'directory',
        children: await getPostsTreeRecursively(postsDirectory)
    };
}

export async function getPostBySlug(slug: string) {
    const fullPath = path.join(postsDirectory, decodeURIComponent(`${slug}.md`));

    const dirPath = path.join(postsDirectory, slug);

    try {
        await fs.access(fullPath);
        // It's a file
        const fileContents = await fs.readFile(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        const processedContent = await unified()
            .use(remarkParse) // markdown -> mdast
            .use(remarkGfm)
            .use(remarkMath)
            .use(remarkRehype) // mdast -> hast
            .use(rehypeKatex)
            .use(rehypeHighlight)
            .use(rehypeStringify)
            .process(content);

        const contentHtml = `<div class="markdown-body">${processedContent.toString()}</div>`;

        return {
            slug,
            content: contentHtml,
            ...data,
        };
    } catch (error) {
        try {
            const stats = await fs.stat(dirPath);
            if (stats.isDirectory()) {
                // It's a directory
                return null;
            }
        } catch {
            // Neither file nor directory exists
            return undefined;
        }
    }
}


export async function getCategoryPosts(category: string) {
    const postsTree = await getPostsTree();

    function findCategoryPosts(node: TreeNode, targetCategory: string): TreeNode[] {
        if (node.type === 'file' && node.path.startsWith(targetCategory)) {
            return [node];
        }
        if (node.type === 'directory') {
            return node.children?.flatMap(child => findCategoryPosts(child, targetCategory)) || [];
        }
        return [];
    }

    return findCategoryPosts(postsTree, category);
}