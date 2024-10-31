import ASTListBar from "@/components/sidebar/ast-tree";
import { getPostBySlug } from "@/lib/get-posts-content";
import { getPostsTree } from "@/lib/get-posts-tree";

export default async function Post({ params }: { params: { slug: string[] } }) {
  const slug = params.slug.join("/");
  const post = await getPostBySlug(slug);

  if (!post) {
    return <div>文章不存在</div>;
  }

  return (
    <article className="flex">
      <div
        className="flex-1 shadow-md"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

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
