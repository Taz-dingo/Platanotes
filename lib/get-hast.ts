import type { Root } from 'hast';
import type { Plugin } from 'unified';

// Use WeakMap to allow garbage collection
const treeCache = new WeakMap<Root, Root>();

// Custom plugin to get HTML syntax tree with memory management
export const getHAST: Plugin<[], Root> = () => (tree: Root) => {
    // Store in WeakMap to allow garbage collection when tree is no longer referenced
    treeCache.set(tree, tree);
    return tree;
};

export const getTreeData = (tree: Root) => {
    return treeCache.get(tree);
};

// Clean up cache for a specific tree
export const clearTreeData = (tree: Root) => {
    treeCache.delete(tree);
};
