import "./globals.css";
import "/public/styles/github-markdown.css";
import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from '@vercel/analytics/next';

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
      </head>
      <body className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-2 px-2 sm:px-4">
        <div className="mx-auto px-2 sm:px-4">
          <header className="my-4 sm:my-8 border-b-2 pb-3 flex flex-col sm:flex-row items-center justify-between px-2 sm:px-5 space-y-4 sm:space-y-0">
            <h1 className="text-3xl sm:text-4xl">
              <Link
                className="text-green-700 hover:text-green-900"
                style={{
                  fontFamily: "LXGW WenKai",
                  fontWeight: "bold",
                }}
                href="/"
              >
                梧桐树下
              </Link>
            </h1>
            <div className="flex items-center space-x-4">
              <h2 className="text-base sm:text-lg">
                <Link
                  className="text-green-700 hover:text-green-900"
                  href="/posts"
                >
                  文章
                </Link>
              </h2>
              <h2 className="text-base sm:text-lg">
                <Link
                  className="text-green-700 hover:text-green-900"
                  href="/about"
                >
                  关于
                </Link>
              </h2>
            </div>
          </header>
          {children}
        </div>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
