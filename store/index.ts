import { FileTreeNode } from '@/lib/get-posts-tree';
import { create } from 'zustand'

// 定义状态接口
export interface TreeStore {
    root: FileTreeNode | undefined; // 保存树结构
    setTreeRoot: (postsTree: FileTreeNode) => void; // 获取树结构的方法
}

export interface PathStore {
    currentPath: string; // 当前路径
    setCurrentPath: (path: string) => void; // 设置当前路径的方法
}


export const usePathStore = create<PathStore>((set) => ({
    currentPath: '', // 初始化路径为空
    setCurrentPath: (path: string) => set({ currentPath: path }), // 设置当前路径
}));

export const useTreeStore = create<TreeStore>((set) => ({
    root: undefined, // 初始化树结构为空
    setTreeRoot: (root: FileTreeNode) => set({ root })
}));
