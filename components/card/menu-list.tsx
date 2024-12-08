"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookText, Camera, Film, Home, Lightbulb } from "lucide-react";

import { DIRECTORY_NAMES } from "@/lib/config/constants";
import type { Post } from "@/lib/posts/get-posts-tree";

// 统一的菜单配置
const menuConfig = {
  home: {
    name: "首页",
    path: "/categories/all",
    icon: Home,
  },
  notes: {
    name: "笔记",
    path: "/categories/notes",
    icon: BookText,
  },
  thoughts: {
    name: "想法",
    path: "/categories/thoughts",
    icon: Lightbulb,
  },
  cinema: {
    name: "放映厅",
    path: "/categories/cinema",
    icon: Film,
  },
  photos: {
    name: "摄影",
    path: "/categories/photos",
    icon: Camera,
  },
} as const;

interface MenuListProps {
  folders: Post[];
}

export default function MenuList({ folders }: MenuListProps) {
  const pathname = usePathname();

  const isSelected = (path: string) => {
    // 移除末尾的斜杠以确保正确匹配
    const currentPath = pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;

    // 如果是文章详情页 (/posts/[...slug])
    if (currentPath.startsWith("/posts/") && !currentPath.startsWith("/categories/")) {
      // 从路径中提取分类
      const pathParts = currentPath.split("/");
      if (pathParts.length >= 3) {
        const category = pathParts[2];
        // 如果是根目录文章，对应到 all 分类
        if (!category || category === "") {
          return path === "/categories/all";
        }
        // 检查当前分类是否匹配菜单项
        const menuPath = `/categories/${category}`;
        return path === menuPath;
      }
    }

    // 其他情况直接比较路径
    return currentPath === path;
  };

  // 获取目录的系统名称
  const getSystemName = (displayName: string): string => {
    const entry = Object.entries(DIRECTORY_NAMES).find(
      ([_, value]) => value.zh === displayName
    );
    return entry ? entry[0] : displayName;
  };

  return (
    <ul className="space-y-1">
      {/* Home link */}
      <li>
        <Link
          href={menuConfig.home.path}
          className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
            isSelected(menuConfig.home.path)
              ? "bg-gray-100 text-green-800"
              : "hover:bg-gray-100 hover:text-green-800"
          }`}
        >
          <menuConfig.home.icon className="text-lg" />
          <span className="whitespace-nowrap">{menuConfig.home.name}</span>
        </Link>
      </li>
      {/* Dynamic folders */}
      {folders.map((folder) => {
        const folderKey = getSystemName(folder.name) as keyof typeof menuConfig;
        const config = menuConfig[folderKey];
        if (!config) return null;

        return (
          <li key={folder.path}>
            <Link
              href={config.path}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
                isSelected(config.path)
                  ? "bg-gray-100 text-green-800"
                  : "hover:bg-gray-100 hover:text-green-800"
              }`}
            >
              <config.icon className="text-lg" />
              <span className="whitespace-nowrap">{config.name}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
