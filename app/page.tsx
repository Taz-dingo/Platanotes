import { getSortedFileList } from "@/lib/posts/get-posts-list";
import GlassCard from "@/components/common/glass-card";
import Link from "next/link";

export default async function Home() {
  const sortedList = await getSortedFileList();

  return (
    <div className="flex flex-col">
        {sortedList.map((node) => {
          const date = new Date(node.metadata?.ctime || 0).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });

          return (
            <GlassCard
              className="mb-3 p-8"
              hover
              key={node.path}
            >
              <Link
                className="group"
                href={`/posts/${node.path}`}
              >
                <h2 className="group-hover:text-green-700 transition duration-300 border-b-2 border-gray-300 pb-1 mb-1 text-xl font-bold">
                  {node.metadata?.title || node.name}
                </h2>
                <p className="text-gray-600 break-all">{node.metadata?.summary}</p>
              </Link>
              <p className="text-sm text-gray-500 mt-2">{date}</p>
            </GlassCard>
          );
        })}
    </div>
  );
}
