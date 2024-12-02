import Link from "next/link";
import path from 'path';
import fs from 'fs/promises';
import { CategoryData } from "@/lib/utils/generate-static-data";
import GlassCard from "@/components/common/glass-card";

interface PageProps {
  params: {
    slug: string;
  };
}

// 从静态文件获取分类数据
async function getCategoryData(): Promise<CategoryData[]> {
  // 每次都动态生成数据
  const { generateAllCategoryData } = await import('@/lib/utils/generate-static-data');
  const data = await generateAllCategoryData();
  
  // 同时更新静态文件，这样构建时的静态文件也会是最新的
  if (process.env.NODE_ENV === 'production') {
    try {
      const filePath = path.join(process.cwd(), 'public', 'static-data', 'category-data.json');
      await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error writing static data:', error);
    }
  }
  
  return data;
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
          <GlassCard 
          className="mb-3 p-8"
           key={node.path} hover>
            <Link
              className="group"
              href={`/posts/${node.path}`}
            >
              <h2 className="group-hover:text-green-700 transition duration-300 border-b-2 border-gray-300 pb-1 mb-1 text-xl font-bold">
                {node.metadata.title || node.name}
              </h2>
              <p className="text-gray-600 break-all">{node.metadata.summary}</p>
            </Link>
            <p className="text-sm text-gray-500 mt-2">{date}</p>
          </GlassCard>
        );
      })}
    </div>
  );
}
