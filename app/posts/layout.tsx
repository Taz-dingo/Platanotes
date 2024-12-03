import React from "react";
import Link from "next/link";
import SidebarContainer from "@/components/sidebar/sidebar-container";
import PageTransition from '@/components/transitions/page-transition';

export default async function PostsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto px-2 sm:px-4">
      <div className="flex flex-col sm:flex-row w-full justify-center relative">
        <div className="w-full sm:w-[18rem] px-2 sm:px-0 sm:pr-4 mb-4 sm:mb-0">
          <SidebarContainer />
        </div>
        <main className="relative px-2 sm:px-0 max-w-[50rem]">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </div>
    </div>
  );
}
