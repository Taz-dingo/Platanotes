import { getSortedFileList } from "@/lib/get-posts-list";
import Link from "next/link";
import { postsPath } from "@/lib/get-posts-tree";

export default async function Home() {
  const sortedList = await getSortedFileList();

  return (
    <div className="flex">
      <div className="w-[50rem]">
        {sortedList.map((node) => {
          const date = new Date(node.metadata?.ctime || 0).toISOString();

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
              <Link href={`/posts/${node.path}`}>
                <h2 className="border-b-2 border-gray-300 pb-1 mb-1">
                  {node.name}
                </h2>
                <p>{node.metadata?.summary}</p>
              </Link>
              <p className="text-sm text-gray-500">{date}</p>
            </div>
          );
        })}
      </div>
      <aside className="w-[20rem] pl-4"></aside>
    </div>
  );
}
