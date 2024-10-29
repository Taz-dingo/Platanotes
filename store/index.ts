import { PathStore, TreeStore } from '@/types/store';
import { TreeNode } from '@/types/tree';
import { create } from 'zustand'


export const usePathStore = create<PathStore>((set) => ({
    currentPath: '', // 初始化路径为空
    setCurrentPath: (path: string) => set({ currentPath: path }), // 设置当前路径
}));

export const useTreeStore = create<TreeStore>((set) => ({
    root: undefined, // 初始化树结构为空
    setTreeRoot: (root: TreeNode) => set({ root })
}));
