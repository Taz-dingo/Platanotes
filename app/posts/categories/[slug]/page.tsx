import fs from "fs/promises";
import path from "path";
import Link from "next/link";

import { POSTS_PER_PAGE } from "@/lib/config/constants";
import {
  CategoryData,
  generateAllCategoryData,
  StaticPostData,
} from "@/lib/utils/generate-static-data";
import PostList from "@/components/posts/post-list";
import ResponsiveASTList from "@/components/sidebar/responsive-ast-list";

interface PageProps {
  params: {
    slug: string;
  };
}

// 从静态文件获取分类数据
async function getCategoryData(): Promise<CategoryData[]> {
  // 每次都动态生成数据
  const data = await generateAllCategoryData();

  // 同时更新静态文件，这样构建时的静态文件也会是最新的
  if (process.env.NODE_ENV === "production") {
    try {
      const filePath = path.join(
        process.cwd(),
        "public",
        "static-data",
        "category-data.json"
      );
      await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
    } catch (error) {
      console.error("Error writing static data:", error);
    }
  }

  return data;
}

// 设置页面重新验证时间
export const revalidate = 300; // 5分钟重新验证一次

// 生成静态页面参数
export async function generateStaticParams() {
  const categories = await generateAllCategoryData();
  return [
    { slug: "all" },
    ...categories.map((category) => ({
      slug: category.slug,
    })),
  ];
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = params;

  // 如果是首页（all），则显示所有文章
  if (slug === "all") {
    const staticDir = path.join(process.cwd(), "public", "static-data");
    const filePath = path.join(staticDir, "category-data.json");

    let categoryData: CategoryData[] = [];
    try {
      const fileContent = await fs.readFile(filePath, "utf-8");
      categoryData = JSON.parse(fileContent);
    } catch (error) {
      console.error("Error reading category data:", error);
      categoryData = await generateAllCategoryData();
    }

    const initialPosts = categoryData
      .reduce<StaticPostData[]>(
        (acc, category) => [...acc, ...category.posts],
        []
      )
      .sort((a, b) => (b.metadata?.ctime || 0) - (a.metadata?.ctime || 0))
      .slice(0, POSTS_PER_PAGE);

    return (
      <div className="flex-1">
        <PostList initialPosts={initialPosts} />
        <ResponsiveASTList />
      </div>
    );
  }

  // 其他分类的处理逻辑
  const staticDir = path.join(process.cwd(), "public", "static-data");
  const filePath = path.join(staticDir, "category-data.json");

  let categoryData: CategoryData[] = [];
  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    categoryData = JSON.parse(fileContent);
  } catch (error) {
    console.error("Error reading category data:", error);
    categoryData = await generateAllCategoryData();
  }

  const category = categoryData.find((cat) => cat.slug === slug);
  const initialPosts = category?.posts
    .sort((a, b) => (b.metadata?.ctime || 0) - (a.metadata?.ctime || 0))
    .slice(0, POSTS_PER_PAGE) || [];

  return (
    <div className="flex-1">
      <PostList initialPosts={initialPosts} />
      <ResponsiveASTList />
    </div>
  );
}
