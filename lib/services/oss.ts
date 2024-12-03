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

// 列出指定目录下的所有对象
export async function listObjects(prefix: string = "Blog/"): Promise<string[]> {
  try {
    const result = await client.list({
      prefix,
      delimiter: "/",
    });
    return result.objects?.map((obj: any) => obj.name) || [];
  } catch (error) {
    console.error("Error listing objects:", error);
    return [];
  }
}

// 获取所有博客分类
export async function getBlogCategories(): Promise<string[]> {
  try {
    const result = await client.list({
      prefix: "Blog/",
      delimiter: "/",
    });
    return result.prefixes || [];
  } catch (error) {
    console.error("Error getting blog categories:", error);
    return [];
  }
}

// 获取特定分类下的所有文章
export async function getCategoryPosts(category: string): Promise<string[]> {
  try {
    const result = await client.list({
      prefix: `Blog/${category}/`,
      delimiter: "/",
    });
    return (result.objects || [])
      .filter((obj: any) => obj.name.endsWith(".md"))
      .map((obj: any) => obj.name);
  } catch (error) {
    console.error("Error getting category posts:", error);
    return [];
  }
}

// 批量获取文章内容
export async function getPostsContent(
  paths: string[]
): Promise<Map<string, string>> {
  const contentMap = new Map<string, string>();

  try {
    // 使用 Promise.all 并行获取所有文章内容
    const contents = await Promise.all(
      paths.map(async (path) => {
        try {
          const result = await client.get(path);
          return { path, content: result.content.toString("utf-8") };
        } catch (error) {
          console.error(`Error getting content for ${path}:`, error);
          return { path, content: "" };
        }
      })
    );

    // 将结果存入 Map
    contents.forEach(({ path, content }) => {
      if (content) {
        contentMap.set(path, content);
      }
    });
  } catch (error) {
    console.error("Error in batch content fetch:", error);
  }

  return contentMap;
}

// 获取特定文章的内容
export async function getPostContent(path: string): Promise<string> {
  try {
    const result = await client.get(path);

    return result.content.toString("utf-8");
  } catch (error) {
    console.error("Error getting post content:", error);
    throw error;
  }
}
