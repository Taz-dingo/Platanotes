"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
        <motion.div
          className="hidden pt-4 md:block"
          initial={{ opacity: 0}}
          animate={{ opacity: 1}}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <TabbedSidebar headings={headings} />
        </motion.div>
      </MenuPortal>

      {/* Mobile Version - Portal to body */}
      <MobilePortal>
        {/* Floating Button */}
        <motion.button
          onClick={() => setShowMobileAst(!showMobileAst)}
          className="fixed bottom-4 right-4 z-50 rounded-full bg-white/50 p-3 shadow-lg backdrop-blur-sm transition-all hover:bg-white/60 md:hidden"
          aria-label="Toggle Table of Contents"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <Menu className="h-6 w-6" />
        </motion.button>
      </MobilePortal>

      {/* Mobile AST List */}
      <AnimatePresence>
        {showMobileAst && (
          <motion.div
            className="fixed inset-y-0 right-0 z-40 w-full bg-black/20 backdrop-blur-sm md:hidden"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <motion.div 
              className="flex h-full items-center justify-end overflow-auto p-4"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <TabbedSidebar headings={headings} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
