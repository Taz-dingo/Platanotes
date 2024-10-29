// 文件树节点类型
export interface FileTreeNode {
    type: 'file' | 'directory'; // 节点类型
    name: string; // 节点名称
    path: string; // 节点路径
    children?: FileTreeNode[]; // 子节点
    metadata?: any; // 元数据
}

// AST 节点类型
export interface ASTNode {
    type: 'root' | 'text' | 'element'; // 类型标识
    tagName?: string; // 仅在元素节点时定义
    properties?: Record<string, any>; // 元素属性
    value?: string; // 仅在文本节点时定义
    position?: {
        start: { line: number; column: number; offset: number };
        end: { line: number; column: number; offset: number };
    }; // 位置属性
    children?: ASTNode[]; // 子节点，可以嵌套，形成树结构
}

// 特殊节点类型，增强可读性
export interface TextNode extends ASTNode {
    type: 'text';
    value: string; // 文本内容
}

export interface ElementNode extends ASTNode {
    type: 'element';
    tagName: string; // HTML 标签名
    properties?: Record<string, any>; // 元素属性
    children?: ASTNode[]; // 子节点
}

export interface RootNode extends ASTNode {
    type: 'root';
    children: ASTNode[]; // 直接子节点
}

