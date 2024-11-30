import Link from "next/link";
import path from 'path';
import fs from 'fs/promises';
import { CategoryData, StaticPostData } from "@/lib/generate-static-data";

interface PageProps {
  params: {
    slug: string;
  };
}

// 从静态文件获取分类数据
async function getCategoryData(): Promise<CategoryData[]> {
  if (process.env.NODE_ENV === 'development') {
    // 在开发环境下直接生成数据
    const { generateAllCategoryData } = await import('@/lib/generate-static-data');
    return generateAllCategoryData();
  } else {
    // 生产环境使用静态文件
    try {
      const filePath = path.join(process.cwd(), 'public', 'static-data', 'category-data.json');
      const fileContent = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(fileContent);
    } catch (error) {
      console.error('Error reading static data:', error);
      // 如果静态文件不存在，也使用动态生成
      const { generateAllCategoryData } = await import('@/lib/generate-static-data');
      return generateAllCategoryData();
    }
  }
}

// 生成静态页面参数
export async function generateStaticParams() {
  const categories = await getCategoryData();
  return categories.map(category => ({
    slug: category.slug
  }));
}

// 设置页面重新验证时间
export const revalidate = 300; // 5分钟重新验证一次

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = params;
  const categories = await getCategoryData();
  const categoryData = categories.find(c => c.slug === slug);
  
  if (!categoryData) {
    return <div>分类不存在</div>;
  }

  return (
    <div className="flex flex-col">
      {categoryData.posts.map((node) => {
        const date = new Date(node.metadata.ctime).toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        return (
          <div
            style={{
              padding: "2rem",
              borderRadius: "10px",
              backgroundColor: "rgba(255, 255, 255, 0.5)",
            }}
            className="mb-2 transition-transform duration-300 will-change-transform transform hover:scale-[1.02] hover:-translate-y-1 shadow-md"
            key={node.path}
          >
            <Link
              className="group"
              href={`/posts/${node.path}`}
            >
              <h2 className="group-hover:text-green-700 transition duration-300 border-b-2 border-gray-300 pb-1 mb-1 text-lg">
                {node.metadata.title || node.name}
              </h2>
              <p className="text-gray-600 break-all">{node.metadata.summary}</p>
            </Link>
            <p className="text-sm text-gray-500 mt-2">{date}</p>
          </div>
        );
      })}
    </div>
  );
}
