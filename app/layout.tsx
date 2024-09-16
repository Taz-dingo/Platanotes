import React from "react";
import Link from "next/link";
import "./globals.css";
import { Metadata } from "next";
import PostListBar from "@/components/post-list-bar";

export const metadata: Metadata = {
  title: "梧桐树下",
  description: "享受片刻宁静",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/github-markdown-css/github-markdown-light.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/highlight.js/styles/github.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex/dist/katex.min.css"
        />
      </head>
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
            <aside className="w-1/4 pr-4">
              <PostListBar />
            </aside>
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
