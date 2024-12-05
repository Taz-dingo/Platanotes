import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { Post } from "@/lib/posts/get-posts-list";

export async function getLocalPosts(): Promise<Post[]> {
  const postsDir = path.join(process.cwd(), "public", "static", "posts");
  const posts: Post[] = [];

  try {
    const files = await fs.readdir(postsDir, { recursive: true });
    
    for (const file of files) {
      if (typeof file === 'string' && file.endsWith('.md')) {
        const filePath = path.join(postsDir, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const { data: frontMatter, content: markdownContent } = matter(content);
        
        // 获取文件名作为标题（不包含日期前缀）
        const fileName = path.basename(file)
          .replace(/^\d{4}\.\d{2}\.\d{2}\s+/, "")
          .replace(/\.md$/, "");

        // 从 frontMatter 中获取时间信息
        const created = frontMatter.created;
        const modified = frontMatter.modified;
        const created_timestamp = created ? Number(created.split(", ").pop()) : 0;
        const modified_timestamp = modified ? Number(modified.split(", ").pop()) : 0;
        
        posts.push({
          path: file.replace(/\.md$/, ""),
          content: markdownContent,
          metadata: {
            title: fileName,
            created,
            modified,
            created_timestamp,
            modified_timestamp,
          },
        });
      }
    }
  } catch (error) {
    console.error("Error reading posts:", error);
  }

  return posts;
}
