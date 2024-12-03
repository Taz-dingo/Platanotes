import { redirect } from "next/navigation";

export default async function Posts() {
  redirect('/posts/categories/all')
}
