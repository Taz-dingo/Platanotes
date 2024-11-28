'use client';

import { useState, useEffect } from 'react';
import ASTListBar from '@/components/sidebar/ast-list-bar';
import { Menu } from 'lucide-react';
import { usePortal } from '@/lib/use-portal';
import { usePathname } from 'next/navigation';

export default function ResponsiveASTList() {
  const [showMobileAst, setShowMobileAst] = useState(false);
  const pathname = usePathname();
  const { Portal: MenuPortal } = usePortal('#menu-card-append');
  const { Portal: MobilePortal } = usePortal('body');

  // 当路由变化时重置移动端显示状态
  useEffect(() => {
    setShowMobileAst(false);
  }, [pathname]);

  return (
    <>
      {/* Desktop Version - Portal to menu-card */}
      <MenuPortal>
        <div className="hidden md:block  pt-4">
          <ASTListBar />
        </div>
      </MenuPortal>

      {/* Mobile Version - Portal to body */}
      <MobilePortal>
        {/* Floating Button */}
        <button
          onClick={() => setShowMobileAst(!showMobileAst)}
          className="md:hidden fixed bottom-4 right-4 bg-white/50 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white/60 transition-all z-50"
          aria-label="Toggle Table of Contents"
        >
          <Menu className="w-6 h-6" />
        </button>
      </MobilePortal>

      {/* Mobile AST List */}
      <div
        className={`md:hidden fixed inset-y-0 right-0 w-full backdrop-blur-sm bg-black/20 transform transition-opacity duration-300 ease-in-out z-40 ${
          showMobileAst ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!showMobileAst}
      >
        <div className="h-full flex items-center justify-end overflow-auto p-4">
          <ASTListBar />
        </div>
      </div>
    </>
  );
}
