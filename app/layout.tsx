import React from "react";
import Link from "next/link";
// 删除这行: import { getAllPosts } from "@/lib/posts";
import "./globals.css";
import Categories from "@/components/categories";
import { Metadata } from "next";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
