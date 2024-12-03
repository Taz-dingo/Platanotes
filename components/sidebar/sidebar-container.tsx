import { Suspense } from "react";

import MenuCard from "@/components/card/menu-card";

export default function SidebarContainer() {
  return (
    <aside className="sticky top-2">
      <Suspense fallback={<div className="min-h-[200px]" />}>
        <MenuCard />
      </Suspense>
      <div id="menu-card-append" />
    </aside>
  );
}
