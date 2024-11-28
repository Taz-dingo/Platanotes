import Breadcrumb, { BreadcrumbItem } from "@/components/bread-crumb";
import ResponsiveASTList from "@/components/sidebar/responsive-ast-list";
import { getPostBySlug } from "@/lib/get-posts-content";
import { getPostsTree } from "@/lib/get-posts-tree";

export default async function Post({ params }: { params: { slug: string[] } }) {
  const slug = params.slug.join("/");
  const post = await getPostBySlug(slug);

  // 构建 BreadcrumbItems
  const items: BreadcrumbItem[] = params.slug.map((segment, index) => {
    // 第一级（分类）使用 /categories/，其他级别使用 /posts/
    const prefix = index === 0 ? "/categories/" : "/posts/";
    const href = prefix + params.slug.slice(0, index + 1).join("/");
    return {
      label: decodeURIComponent(segment.replace(/-/g, " ")),
      href,
    };
  });

  if (!post) {
    return <div>文章不存在</div>;
  }

  return (
    <article className="flex-1 transition">
      <div className="flex-1">
        <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.5)] mb-2 shadow-md">
          <Breadcrumb items={items} />
        </div>
        <div
          className="shadow-md rounded-lg"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
      <ResponsiveASTList />
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
