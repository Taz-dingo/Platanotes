import { getCategoryPosts } from "@/lib/get-posts-list";
import Link from "next/link";

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = params;
  const posts = await getCategoryPosts(slug);

  return (
    <div className="flex flex-col">
        {posts.map((node) => {
          const date = new Date(node.metadata?.ctime || 0).toLocaleDateString('zh-CN', {
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
                  {node.metadata?.title || node.name}
                </h2>
                <p className="text-gray-600 break-all">{node.metadata?.summary}</p>
              </Link>
              <p className="text-sm text-gray-500 mt-2">{date}</p>
            </div>
          );
        })}
    </div>
  );
}