import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'posts');

function getPostsRecursively(dir: string, basePath: string = ''): any[] {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    return entries.flatMap(entry => {
        const res = path.resolve(dir, entry.name);
        const currentPath = path.join(basePath, entry.name);

        if (entry.isDirectory()) {
            return getPostsRecursively(res, currentPath);
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
            const fileContents = fs.readFileSync(res, 'utf8');
            const { data } = matter(fileContents);
            return [{
                slug: currentPath.replace(/\.md$/, ''),
                ...data,
            }];
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
    // const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fullPath = path.join(postsDirectory, decodeURIComponent(`${slug}.md`));

    const dirPath = path.join(postsDirectory, slug);
    console.log("🚀 ~ getPostBySlug ~ fullPath:", fullPath)
    console.log("🚀 ~ getPostBySlug ~ dirPath:", dirPath)

    console.log("🚀 ~ getPostBySlug ~ fs.existsSync(fullPath):", fs.existsSync(fullPath))
    if (fs.existsSync(fullPath)) {
        // It's a file
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        console.log("🚀 ~ getPostBySlug ~ fileContents:", fileContents)
        const { data, content } = matter(fileContents);
        console.log("🚀 ~ getPostBySlug ~ { data, content }:", { data, content })

        const processedContent = await remark()
            .use(html)
            .process(content);
        const contentHtml = processedContent.toString();

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
    console.log("🚀 ~ getCategoryPosts ~ category:", category)
    const allPosts = getAllPosts();
    console.log("🚀 ~ getCategoryPosts ~ allPosts:", allPosts)
    return allPosts.filter(post => post.slug.startsWith(category + '/'));
}