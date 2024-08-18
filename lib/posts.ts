import fs from 'fs';
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

function getPostsRecursively(dir: string, basePath: string = ''): any[] {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    return entries.flatMap(entry => {
        const res = path.resolve(dir, entry.name);
        const currentPath = path.join(basePath, entry.name);

        if (entry.isDirectory()) {
            return getPostsRecursively(res, currentPath);
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
            try {
                const fileContents = fs.readFileSync(res, 'utf8');
                const { data } = matter(fileContents);
                return [{
                    slug: currentPath.replace(/\.md$/, ''),
                    ...data,
                }];
            } catch (error) {
                console.error(`Error reading file ${res}:`, error);
                return [];
            }

        } else {
            return [];
        }
    });
}

export function getAllPosts() {
    const allPosts = getPostsRecursively(postsDirectory);
    return allPosts.sort((a, b) => ((a.date as string) < (b.date as string) ? 1 : -1));
}

export async function getPostBySlug(slug: string) {
    const fullPath = path.join(postsDirectory, decodeURIComponent(`${slug}.md`));

    const dirPath = path.join(postsDirectory, slug);

    if (fs.existsSync(fullPath)) {
        // It's a file
        const fileContents = fs.readFileSync(fullPath, 'utf8');
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
    } else if (fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory()) {
        // It's a directory
        return null;
    } else {
        // Neither file nor directory exists
        return undefined;
    }
}

export function getCategoryPosts(category: string) {
    category = decodeURIComponent(category);
    const allPosts = getAllPosts();
    return allPosts.filter(post => post.slug.startsWith(category + '/'));
}