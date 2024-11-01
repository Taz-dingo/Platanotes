import Breadcrumb, { BreadcrumbItem } from "@/components/bread-crumb";
import ASTListBar from "@/components/sidebar/ast-tree";
import { getPostBySlug } from "@/lib/get-posts-content";
import { getPostsTree } from "@/lib/get-posts-tree";

export default async function Post({ params }: { params: { slug: string[] } }) {
  const slug = params.slug.join("/");
  const post = await getPostBySlug(slug);

  // 构建 BreadcrumbItems
  const items: BreadcrumbItem[] = params.slug.map((segment, index) => {
    const href = "/posts/" + params.slug.slice(0, index + 1).join("/"); // 生成 href
    return {
      label: decodeURIComponent(segment.replace(/-/g, " ")), // 将链接中的短横线替换为空格，作为标签
      href,
    };
  });

  if (!post) {
    return <div>文章不存在</div>;
  }

  return (
    <article className="flex transition">
      <div>
        <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.5)] mb-2 shadow-md">
          <Breadcrumb items={items} />
        </div>
        <div
          className="flex-1 shadow-md rounded-lg"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      <aside className="w-[20rem] pl-4">
        <ASTListBar />
      </aside>
    </article>
  );
}

export async function generateStaticParams() {
  const postsTree = getPostsTree();

  function flattenTree(node: any): string[][] {
    if (node.type === "file") {
      return [node.path.split("/")];
    }
    if (node.children) {
      return node.children.flatMap(flattenTree);
    }
    return [];
  }

  const paths = flattenTree(postsTree);

  return paths.map((slug) => ({ slug }));
}
