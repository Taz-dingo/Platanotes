import { Suspense } from "react";

import MenuCard from "@/components/card/menu-card";
import ProfileCard from "@/components/card/profile-card";

interface SidebarContainerProps {
  segment?: string;
}

export default function SidebarContainer({ segment }: SidebarContainerProps) {
  const isCategories = segment === "categories";

  return (
    <aside className="sticky top-2">
      <Suspense fallback={<div className="min-h-[200px]" />}>
        <MenuCard />
      </Suspense>
      {isCategories ? (
        <Suspense fallback={<div className="min-h-[200px]" />}>
          <div className="hidden py-4 md:block">
            <ProfileCard />
          </div>
        </Suspense>
      ) : (
        <div id="menu-card-append" />
      )}
    </aside>
  );
}
