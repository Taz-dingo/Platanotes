"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { usePortal } from "@/hooks/use-portal";

import TabbedSidebar from "./tabbed-sidebar";

interface ResponsiveASTListProps {
  headings?: { level: number; text: string }[];
}

export default function ResponsiveASTList({
  headings = [],
}: ResponsiveASTListProps) {
  const [showMobileAst, setShowMobileAst] = useState(false);
  const pathname = usePathname();
  const { Portal: MenuPortal } = usePortal("#menu-card-append");
  const { Portal: MobilePortal } = usePortal("body");

  // 当路由变化时重置移动端显示状态
  useEffect(() => {
    setShowMobileAst(false);
  }, [pathname]);

  return (
    <>
      {/* Desktop Version - Portal to menu-card */}
      <MenuPortal>
        <div className="hidden pt-4 md:block">
          <TabbedSidebar headings={headings} />
        </div>
      </MenuPortal>

      {/* Mobile Version - Portal to body */}
      <MobilePortal>
        {/* Floating Button */}
        <button
          onClick={() => setShowMobileAst(!showMobileAst)}
          className="fixed bottom-4 right-4 z-50 rounded-full bg-white/50 p-3 shadow-lg backdrop-blur-sm transition-all hover:bg-white/60 md:hidden"
          aria-label="Toggle Table of Contents"
        >
          <Menu className="h-6 w-6" />
        </button>
      </MobilePortal>

      {/* Mobile AST List */}
      <div
        className={`fixed inset-y-0 right-0 z-40 w-full transform bg-black/20 backdrop-blur-sm transition-opacity duration-300 ease-in-out md:hidden ${
          showMobileAst ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!showMobileAst}
      >
        <div className="flex h-full items-center justify-end overflow-auto p-4">
          <TabbedSidebar headings={headings} />
        </div>
      </div>
    </>
  );
}
