import "./globals.css";
import "/public/styles/github-markdown.css";
import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import PostListBar from "@/components/sidebar/post-list-bar";
import Script from "next/script";

export const metadata: Metadata = {
  title: "梧桐树下",
  description: "享受片刻宁静",
  icons: "/favicon.ico",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.1.0/style.css"
        />
        <link
          rel="stylesheet"
          href="/styles/github-markdown.css"
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
        {/* <FallingLeaves /> */}
        <div className="container mx-auto px-4">
          <header className="my-8 border-b-2 pb-3">
            <h1 className="text-4xl">
              <Link
                //  去掉下划线和点击后变色
                className="text-green-700 hover:text-green-900"
                style={{
                  fontFamily: "LXGW WenKai",
                  fontWeight:'bold'
                }}
                href="/"
              >
                梧桐树下
              </Link>
            </h1>
          </header>
          <div className="flex w-full justify-center relative">
            <aside className="w-[18rem] pr-4">
              <PostListBar />
            </aside>
            <main className="relative">{children}</main>
          </div>
          <footer className="mt-8 py-4 text-center text-gray-500">
            © {new Date().getFullYear()} Tazdingo
          </footer>
        </div>
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/processing.js/1.6.6/processing.min.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
