"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { List, User } from "lucide-react";

import ProfileItem from "@/components/card/profile-item";
import GlassCard from "@/components/common/glass-card";
import ArticleTOC from "@/components/sidebar/article-toc";

interface TabbedSidebarProps {
  headings?: { level: number; text: string }[];
}

export default function TabbedSidebar({ headings = [] }: TabbedSidebarProps) {
  console.log(headings);
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<"toc" | "profile">("profile");

  // Automatically switch to toc tab when in a post page and headings are available
  useEffect(() => {
    const isPostPage = pathname.split("/").length > 2;
    if (isPostPage && headings.length > 0) {
      setActiveTab("toc");
    }
  }, [pathname, headings]);

  return (
    <GlassCard className="w-[60%] transition-all duration-[1000ms] ease-in-out md:w-full">
      {/* Tab Header */}

      {headings.length > 0 && (
        <>
          <div className="mb-4 flex border-b-2 border-slate-300">
            <button
              className={`-mb-[2px] flex flex-1 items-center justify-center gap-2 px-4 py-2 ${
                activeTab === "profile"
                  ? "border-b-2 border-green-700 text-green-700"
                  : "text-gray-500 hover:text-green-700"
              }`}
              onClick={() => setActiveTab("profile")}
            >
              <User className="h-5" />
            </button>
            <button
              className={`-mb-[2px] flex flex-1 items-center justify-center gap-2 px-4 py-2 ${
                activeTab === "toc"
                  ? "border-b-2 border-green-700 text-green-700"
                  : "text-gray-500 hover:text-green-700"
              }`}
              onClick={() => setActiveTab("toc")}
            >
              <List className="h-5" />
            </button>
          </div>
        </>
      )}

      {/* Tab Content */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {activeTab === "profile" ? (
            <motion.div
              key="profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ProfileItem
                name={"Tazdingo"}
                avatar="/avatar.png"
                role="我是一只鱼"
                bio=""
                socialLinks={{
                  email: "tazdingo@foxmail.com",
                  github: "https://github.com/Taz-dingo",
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="toc"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ArticleTOC headings={headings} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GlassCard>
  );
}
