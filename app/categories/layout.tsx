import React from "react";

import SidebarContainer from "@/components/sidebar/sidebar-container";
import PageTransition from "@/components/transitions/page-transition";

export default async function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto px-2 md:px-4">
      <div className="relative flex w-full flex-col justify-center md:flex-row">
        <div className="mb-4 w-full px-2 md:mb-0 md:w-[18rem] md:px-0 md:pr-4">
          <SidebarContainer segment="categories" />
        </div>
        <main className="relative px-2 md:w-[50rem] md:px-0">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  );
} 