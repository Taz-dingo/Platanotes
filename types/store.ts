import { TreeNode } from "@/types/tree";

// 定义状态接口
export interface TreeStore {
    root: TreeNode | undefined; // 保存树结构
    setTreeRoot: (postsTree: TreeNode) => void; // 获取树结构的方法
}

export interface PathStore {
    currentPath: string; // 当前路径
    setCurrentPath: (path: string) => void; // 设置当前路径的方法
}