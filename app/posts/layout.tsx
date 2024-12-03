import React from "react";
import Link from "next/link";

import SidebarContainer from "@/components/sidebar/sidebar-container";
import PageTransition from "@/components/transitions/page-transition";

export default async function PostsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto px-2 sm:px-4">
      <div className="relative flex w-full flex-col justify-center sm:flex-row">
        <div className="mb-4 w-full px-2 sm:mb-0 sm:w-[18rem] sm:px-0 sm:pr-4">
          <SidebarContainer />
        </div>
        <main className="relative max-w-[50rem] px-2 sm:px-0">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  );
}
