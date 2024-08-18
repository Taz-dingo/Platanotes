import React from "react";
import { notFound } from "next/navigation";
import { getAllPosts, getCategoryPosts, getPostBySlug } from "@/lib/posts";
import { PostList } from "@/components/post-list";

export default async function PostOrCategory({
  params,
}: {
  params: { slug: string[] };
}) {
  const slug = decodeURIComponent(params.slug.join("/"));
  console.log("🚀 ~ slug!!:", slug);
  const post = await getPostBySlug(slug);
  console.log("🚀 ~ post:", post);

  if (post) {
    const title = post.slug.split("/")[slug.split("/").length - 1];
    return (
      <article>
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        <p className="text-gray-500 mb-4">Category: {slug.split("/")[0]}</p>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    );
  } else {
    const categoryPosts = getCategoryPosts(slug);
    if (categoryPosts.length === 0) {
      notFound();
    }

    return (
      <>
        <h2 className="text-2xl font-semibold mb-4">Posts in {slug}</h2>
        <PostList posts={categoryPosts} />
      </>
    );
  }
}
