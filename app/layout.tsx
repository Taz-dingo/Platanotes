import React from "react";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const posts = getAllPosts();
  const categories = Array.from(
    new Set(posts.map((post) => post.slug.split("/")[0]))
  );

  return (
    <html lang="en">
      <body>
        <div className="container mx-auto px-4">
          <header className="my-8">
            <h1 className="text-4xl font-bold">
              <Link
                //  去掉下划线和点击后变色
                className="text-blue-600 hover:underline"
                href="/"
              >
                梧桐树下
              </Link>
            </h1>
          </header>
          <div className="flex">
            <nav className="w-1/4 pr-4">
              <h2 className="text-xl font-semibold mb-2">Categories</h2>
              <ul>
                {categories.map((category) => (
                  <li key={category}>
                    <Link
                      href={`/${category}`}
                      className="text-blue-600 hover:underline"
                    >
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <main className="w-3/4">{children}</main>
          </div>
          <footer className="mt-8 py-4 text-center text-gray-500">
            © {new Date().getFullYear()} Tazdingo
          </footer>
        </div>
      </body>
    </html>
  );
}
