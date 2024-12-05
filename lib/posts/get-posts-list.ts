import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import moment from "moment";
import { DIRECTORY_NAMES } from "@/lib/config/constants";

export interface Post {
  path: string;
  content: string;
  metadata?: {
    title?: string;
    created?: string;
    modified?: string;
    created_timestamp?: number;
    modified_timestamp?: number;
  };
}

// 获取目录的展示名称
export async function getDirectoryDisplayName(
  dirName: string
): Promise<string> {
  const key = dirName.toLowerCase() as keyof typeof DIRECTORY_NAMES;
  return DIRECTORY_NAMES[key]?.zh || dirName;
}

// 获取目录的系统名称
export async function getDirectorySystemName(
  displayName: string
): Promise<string> {
  const entry = Object.entries(DIRECTORY_NAMES).find(
    ([_, value]) => value.zh === displayName
  );
  return entry ? entry[0] : displayName;
}

// 从本地文件系统获取所有文章
async function getAllPosts(): Promise<Post[]> {
  const postsDir = path.join(process.cwd(), "public", "static", "posts");
  const posts: Post[] = [];

  async function processDirectory(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        await processDirectory(fullPath);
      } else if (entry.name.endsWith(".md")) {
        const content = await fs.readFile(fullPath, "utf-8");
        const { data: frontMatter, content: markdownContent } = matter(content);
        
        // 获取文件名作为标题（不包含日期前缀和扩展名）
        const fileName = entry.name.replace(/^\d{4}\.\d{2}\.\d{2}\s+/, "").replace(/\.md$/, "");
        
        // 从 frontMatter 中获取时间信息
        const created = frontMatter.created;
        const modified = frontMatter.modified;
        const created_timestamp = created ? Number(created.split(", ").pop()) : 0;
        const modified_timestamp = modified ? Number(modified.split(", ").pop()) : 0;
        
        posts.push({
          path: path.relative(postsDir, fullPath).replace(/\.md$/, ""),
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
  }

  try {
    await processDirectory(postsDir);
  } catch (error) {
    console.error("Error reading posts directory:", error);
  }

  return posts;
}

// 根据类别获取所有相关的文章
export async function getCategoryPosts(category: string): Promise<Post[]> {
  try {
    const allPosts = await getAllPosts();
    const posts = allPosts.filter(post => {
      const postCategory = post.path.split(path.sep)[0];
      return postCategory === category;
    });
    
    return posts.sort((a, b) => 
      (b.metadata?.modified_timestamp || b.metadata?.created_timestamp || 0) -
      (a.metadata?.modified_timestamp || a.metadata?.created_timestamp || 0)
    );
  } catch (error) {
    console.error("Error loading posts:", error);
    return [];
  }
}

// 获取所有文章列表，按时间排序
export async function getSortedFileList(
  page?: number,
  limit?: number
): Promise<Post[]> {
  try {
    const allPosts = await getAllPosts();
    const sortedPosts = allPosts.sort((a, b) => 
      (b.metadata?.modified_timestamp || b.metadata?.created_timestamp || 0) -
      (a.metadata?.modified_timestamp || a.metadata?.created_timestamp || 0)
    );

    if (page && limit) {
      const start = (page - 1) * limit;
      const end = start + limit;
      return sortedPosts.slice(start, end);
    }

    return sortedPosts;
  } catch (error) {
    console.error("Error loading posts:", error);
    return [];
  }
}
