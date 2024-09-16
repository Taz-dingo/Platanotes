import { getPostBySlug, getPostsTree } from '../../../lib/posts';

export default async function Post({ params }: { params: { slug: string[] } }) {
  const slug = params.slug.join('/');
  const post = await getPostBySlug(slug);

  if (!post) {
    return <div>文章不存在</div>;
  }

  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}

export async function generateStaticParams() {
  const postsTree = getPostsTree();

  function flattenTree(node: any): string[][] {
    if (node.type === 'file') {
      return [node.path.split('/')];
    }
    if (node.children) {
      return node.children.flatMap(flattenTree);
    }
    return [];
  }

  const paths = flattenTree(postsTree);

  return paths.map((slug) => ({ slug }));
}