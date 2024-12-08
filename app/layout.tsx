import "./globals.css";
import "/public/styles/github-markdown.css";

import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ThemeToggle from "@/components/theme/theme-toggle";

export const metadata: Metadata = {
  title: "梧桐树下",
  description: "享受片刻宁静",
  icons: "/favicon.ico",
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
          rel="preload"
          href="https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.1.0/style.css"
          as="style"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.1.0/style.css"
        />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 px-2 py-2 md:px-4">
        <div className="mx-auto px-0 md:px-4">
          <header className="my-4 flex flex-col items-center justify-between space-y-4 border-b-2 px-2 pb-3 md:my-8 md:flex-row md:space-y-0 md:px-10">
            <h1 className="text-3xl md:text-4xl">
              <Link className="text-green-700 hover:text-green-900" href="/">
                梧桐树下
              </Link>
            </h1>
            <div className="flex items-center space-x-4">
              <h2 className="text-base md:text-lg">
                <Link
                  className="text-green-700 hover:text-green-900"
                  href="/posts"
                >
                  文章
                </Link>
              </h2>
              <h2 className="text-base md:text-lg">
                <Link
                  className="text-green-700 hover:text-green-900"
                  href="/about"
                >
                  关于
                </Link>
              </h2>
              <ThemeToggle />
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
