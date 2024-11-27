'use client';


import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaBook, FaLightbulb, FaFilm, FaCamera } from "react-icons/fa";
import type { FileTreeNode } from "@/lib/get-posts-tree";
import { DIRECTORY_NAMES } from "@/lib/constants";

// 统一的菜单配置
const menuConfig = {
  home: {
    name: "首页",
    path: "/",
    icon: FaHome
  },
  notes: {
    name: "笔记",
    path: "/posts/notes",
    icon: FaBook
  },
  thoughts: {
    name: "想法",
    path: "/posts/thoughts",
    icon: FaLightbulb
  },
  cinema: {
    name: "放映厅",
    path: "/posts/cinema",
    icon: FaFilm
  },
  photos: {
    name: "摄影",
    path: "/posts/photos",
    icon: FaCamera
  }
} as const;

interface MenuListProps {
  folders: FileTreeNode[];
}

export default function MenuList({ folders }: MenuListProps) {
  const pathname = usePathname();

  const isSelected = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path === '/') return false;
    
    // 移除末尾的斜杠以确保正确匹配
    const currentPath = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
    const targetPath = path.endsWith('/') ? path.slice(0, -1) : path;
    
    // 检查当前路径是否以目标路径开头
    return currentPath.startsWith(targetPath);
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
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
            isSelected(menuConfig.home.path)
              ? 'text-green-800 bg-gray-100' 
              : 'hover:text-green-800 hover:bg-gray-100'
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
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isSelected(config.path)
                  ? 'text-green-800 bg-gray-100' 
                  : 'hover:text-green-800 hover:bg-gray-100'
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
