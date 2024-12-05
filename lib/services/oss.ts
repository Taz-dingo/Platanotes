const path = require("path");
const fs = require("fs/promises");

const OSS = require("ali-oss");

// 根据环境加载不同的配置文件
const envFile =
  process.env.NODE_ENV === "production" ? ".env.production" : ".env.local";
require("dotenv").config({ path: envFile });

const client = new OSS({
  // region填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
  region: process.env.OSS_REGION,
  // 从环境变量中获取访问凭证。
  accessKeyId: process.env.OSS_ACCESS_KEY_ID,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
  // bucket填写Bucket名称。
  bucket: process.env.OSS_BUCKET,
});

// 列出 Blog 目录下的所有对象
async function listObjects(): Promise<string[]> {
  const prefix = "Blog/";
  try {
    const result = await client.list({
      prefix,
      "max-keys": 1000, // 设置较大的值以确保获取所有文件
    });

    console.log("OSS list result:", result);

    // 只返回文件（排除目录），并且移除 Blog/ 前缀
    return (result.objects || [])
      .filter((obj: any) => {
        // 确保是文件而不是目录
        const name = obj.name as string;
        return name !== prefix && !name.endsWith("/");
      })
      .map((obj: any) => {
        // 移除 Blog/ 前缀
        const name = obj.name as string;
        return name.substring(prefix.length);
      });
  } catch (error) {
    console.error("Error listing objects:", error);
    return [];
  }
}

// 检查是否需要同步
export async function shouldSync(): Promise<boolean> {
  const syncFlagPath = path.join(
    process.cwd(),
    "public",
    "static",
    "posts",
    ".sync"
  );
  try {
    const stats = await fs.stat(syncFlagPath);
    const now = Date.now();
    // 如果同步标记文件超过1小时，则需要重新同步
    console.log("last sync time:", stats.mtimeMs);
    console.log("now time:", now);
    return now - stats.mtimeMs > 60000;
  } catch (error) {
    // 如果文件不存在，需要同步
    return true;
  }
}

// 更新同步时间戳
async function updateSyncFlag(): Promise<void> {
  const syncFlagPath = path.join(
    process.cwd(),
    "public",
    "static",
    "posts",
    ".sync"
  );
  const syncDir = path.dirname(syncFlagPath);
  await fs.mkdir(syncDir, { recursive: true });
  await fs.writeFile(syncFlagPath, new Date().toISOString());
}

// 下载 Blog 目录下的所有对象到本地的 /public/static/posts 目录
export async function downloadAllObjects(): Promise<void> {
  try {
    // 检查是否需要同步
    const needSync = await shouldSync();
    if (!needSync) {
      console.log("Files are up to date, skipping download");
      return;
    }

    const objects = await listObjects();
    console.log(`Found ${objects.length} files in Blog directory`);

    for (const objectName of objects) {
      const ossPath = `Blog/${objectName}`;
      console.log(`Downloading: ${ossPath}`);

      try {
        const result = await client.get(ossPath);
        const localPath = path.join(
          process.cwd(),
          "public",
          "static",
          "posts",
          objectName
        );

        await fs.mkdir(path.dirname(localPath), { recursive: true });
        await fs.writeFile(localPath, result.content);
        console.log(`Successfully downloaded: ${objectName}`);
      } catch (error) {
        console.error(`Error downloading ${ossPath}:`, error);
        // 继续下载其他文件
        continue;
      }
    }

    // 更新同步时间戳
    await updateSyncFlag();
    console.log("All objects downloaded successfully");
  } catch (error) {
    console.error("Error downloading objects:", error);
  }
}

// // 获取所有博客分类
// export async function getBlogCategories(): Promise<string[]> {
//   try {
//     const result = await client.list({
//       prefix: "Blog/",
//       delimiter: "/",
//     });
//     return result.prefixes || [];
//   } catch (error) {
//     console.error("Error getting blog categories:", error);
//     return [];
//   }
// }

// // 获取特定分类下的所有文章
// export async function getCategoryPosts(category: string): Promise<string[]> {
//   try {
//     const result = await client.list({
//       prefix: `Blog/${category}/`,
//       delimiter: "/",
//     });
//     return (result.objects || [])
//       .filter((obj: any) => obj.name.endsWith(".md"))
//       .map((obj: any) => obj.name);
//   } catch (error) {
//     console.error("Error getting category posts:", error);
//     return [];
//   }
// }

// // 批量获取文章内容
// export async function getPostsContent(
//   paths: string[]
// ): Promise<Map<string, string>> {
//   const contentMap = new Map<string, string>();

//   try {
//     // 使用 Promise.all 并行获取所有文章内容
//     const contents = await Promise.all(
//       paths.map(async (path) => {
//         try {
//           const result = await client.get(path);
//           return { path, content: result.content.toString("utf-8") };
//         } catch (error) {
//           console.error(`Error getting content for ${path}:`, error);
//           return { path, content: "" };
//         }
//       })
//     );

//     // 将结果存入 Map
//     contents.forEach(({ path, content }) => {
//       if (content) {
//         contentMap.set(path, content);
//       }
//     });
//   } catch (error) {
//     console.error("Error in batch content fetch:", error);
//   }

//   return contentMap;
// }

// // 获取特定文章的内容
// export async function getPostContent(path: string): Promise<string> {
//   try {
//     const result = await client.get(path);

//     return result.content.toString("utf-8");
//   } catch (error) {
//     console.error("Error getting post content:", error);
//     throw error;
//   }
// }
