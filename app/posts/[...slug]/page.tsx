import Breadcrumb, { BreadcrumbItem } from "@/components/bread-crumb";
import ResponsiveASTList from "@/components/sidebar/responsive-ast-list";
import GlassCard from "@/components/common/glass-card";
import { getPostBySlug } from "@/lib/posts/get-posts-content";
import { getPostsTree } from "@/lib/posts/get-posts-tree";

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
        <GlassCard className="mb-2">
          <Breadcrumb items={items} />
        </GlassCard>
        <GlassCard>
          <div
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </GlassCard>
      </div>
      <ResponsiveASTList headings={post.headings} />
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
