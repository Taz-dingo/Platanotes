import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

/**
 * 博客文章数据结构定义和相关操作
 */

// 博客文章类型
export interface Post {
  type: "file" | "directory"; // 类型（文件或目录）
  name: string; // 文章名称
  path: string; // 文章路径
  children?: Post[]; // 子文章（如果是目录）
  metadata?: {
    created?: string;
    modified?: string;
    created_timestamp?: number;
    modified_timestamp?: number;
    title?: string;
  }; // 文章元数据
}

// 递归构建目录树
async function buildDirectoryTree(dirPath: string, relativePath: string = ""): Promise<Post[]> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const result: Post[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const entryRelativePath = path.join(relativePath, entry.name);

    if (entry.isDirectory()) {
      const children = await buildDirectoryTree(fullPath, entryRelativePath);
      if (children.length > 0) {
        result.push({
          type: "directory",
          name: entry.name,
          path: entryRelativePath,
          children,
        });
      }
    } else if (entry.name.endsWith(".md")) {
      try {
        const content = await fs.readFile(fullPath, "utf-8");
        const { data: frontMatter } = matter(content);
        
        // 获取文件名作为标题（不包含日期前缀）
        const title = entry.name
          .replace(/^\d{4}\.\d{2}\.\d{2}\s+/, "")
          .replace(/\.md$/, "");

        // 从 frontMatter 中获取时间信息
        const created = frontMatter.created;
        const modified = frontMatter.modified;
        const created_timestamp = created ? Number(created.split(", ").pop()) : 0;
        const modified_timestamp = modified ? Number(modified.split(", ").pop()) : 0;

        result.push({
          type: "file",
          name: title,
          path: entryRelativePath.replace(/\.md$/, ""),
          metadata: {
            title,
            created,
            modified,
            created_timestamp,
            modified_timestamp,
          },
        });
      } catch (error) {
        console.error(`Error processing file ${fullPath}:`, error);
      }
    }
  }

  // 按修改时间（或创建时间）排序
  return result.sort((a, b) => {
    if (a.type === "directory" && b.type === "file") return -1;
    if (a.type === "file" && b.type === "directory") return 1;
    if (a.type === b.type) {
      if (a.type === "file") {
        const aTime = a.metadata?.modified_timestamp || a.metadata?.created_timestamp || 0;
        const bTime = b.metadata?.modified_timestamp || b.metadata?.created_timestamp || 0;
        return bTime - aTime;
      }
      return a.name.localeCompare(b.name);
    }
    return 0;
  });
}

// 从本地文件系统获取文章树结构
export async function getPostsTree(): Promise<Post> {
  try {
    const postsDir = path.join(process.cwd(), "public", "static", "posts");
    const children = await buildDirectoryTree(postsDir);

    return {
      type: "directory",
      name: "Blog",
      path: "",
      children,
    };
  } catch (error) {
    console.error("Error building posts tree:", error);
    // 如果构建失败，返回空树
    return {
      type: "directory",
      name: "Blog",
      path: "",
      children: [],
    };
  }
}

// 获取文件树
export async function getFileTree(): Promise<Post> {
  return getPostsTree();
}
