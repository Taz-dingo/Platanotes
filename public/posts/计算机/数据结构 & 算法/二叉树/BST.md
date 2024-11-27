---
created: 星期四, 八月 22日 2024, 10:28:45 晚上, 1724336925000
modified: 星期四, 八月 22日 2024, 10:28:45 晚上, 1724336925000
---


DECK: 算法
## BST - 二叉搜索树

### ACM模式
实现增、删、查的BST
```javascript
class TreeNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

class BinarySearchTree {
    constructor() {
        this.root = null;
    }

    // 插入方法
    insert(value) {
        const newNode = new TreeNode(value);
        if (this.root === null) {
            this.root = newNode;
        } else {
            this.insertNode(this.root, newNode);
        }
    }

    insertNode(node, newNode) {
        if (newNode.value < node.value) {
            if (node.left === null) {
                node.left = newNode;
            } else {
                this.insertNode(node.left, newNode);
            }
        } else {
            if (node.right === null) {
                node.right = newNode;
            } else {
                this.insertNode(node.right, newNode);
            }
        }
    }

    // 查找方法
    search(value) {
        return this.searchNode(this.root, value);
    }

    searchNode(node, value) {
        if (node === null) {
            return false;
        } else if (value < node.value) {
            return this.searchNode(node.left, value);
        } else if (value > node.value) {
            return this.searchNode(node.right, value);
        } else {
            return true;
        }
    }

    // 删除方法
    delete(value) {
        this.root = this.deleteNode(this.root, value);
    }

    deleteNode(node, value) {
        if (node === null) {
            return null;
        }

        if (value < node.value) {
            node.left = this.deleteNode(node.left, value);
        } else if (value > node.value) {
            node.right = this.deleteNode(node.right, value);
        } else {
            // 节点有两子树
            if (node.left !== null && node.right !== null) {
                const minValue = this.findMinValue(node.right);
                node.value = minValue;
                node.right = this.deleteNode(node.right, minValue);
            } else {
                // 节点只有一个子树或没有子树
                if (node.left !== null) {
                    return node.left;
                } else if (node.right !== null) {
                    return node.right;
                } else {
                    return null;
                }
            }
        }
        return node;
    }

    findMinValue(node) {
        let current = node;
        while (current.left !== null) {
            current = current.left;
        }
        return current.value;
    }
}
```



---

### 改变结构
改变结构的递归最好是return回溯版 / 后序遍历版，用在需要改树结构的时候，可以避免要用到preNode的尴尬

#### [701. 二叉搜索树中的插入操作](https://leetcode.cn/problems/insert-into-a-binary-search-tree/)
```typescript
/**
不需要考虑平衡，只按BST逻辑插入很简单
按BST规则递归下去，最后到null的时候说明到了插入位置，直接返回即可
 */
function insertIntoBST(root: TreeNode | null, val: number): TreeNode | null {
    if(!root) return new TreeNode(val);

    if(val > root.val){
        root.right = insertIntoBST(root.right,val);
    }else{
        root.left = insertIntoBST(root.left,val);
    }

    return root;
};
```

#### [450. 删除二叉搜索树中的节点](https://leetcode.cn/problems/delete-node-in-a-bst/)
```typescript
/**
没找到，返回null
找到了，光棍，返回null
找到了，独臂，返回那个存在的
找到了，双臂，左子树挂到右子树的最左叶上 / 右子树挂到左子树的最右叶，返回还在那个
 */
function deleteNode(root: TreeNode | null, key: number): TreeNode | null {
    if(!root) return null;
    if(root.val === key){
        if(!root.left && !root.right) return null;
        if(!root.left || !root.right) return root.left || root.right;
        if(root.left && root.right){
            let cur = root.right;
            while(cur.left) cur = cur.left;
            cur.left = root.left;

            return root.right;
        }
    }

    if(key > root.val){
        root.right = deleteNode(root.right,key);
    }else{
        root.left = deleteNode(root.left,key);
    }

    return root;
};  
```




---




### 其他
#### [700. 二叉搜索树中的搜索](https://leetcode.cn/problems/search-in-a-binary-search-tree/)
```typescript
// BST规则递归下去
function searchBST(root: TreeNode | null, val: number): TreeNode | null {
    if(!root) return null;
    if(val === root.val){
        return root;
    }else if(val > root.val){
        return searchBST(root.right,val);
    }else{
        return searchBST(root.left,val);
    }
};
```
好吧，不改结构也可以用，但是改结构的最好用返回式的，回溯阶段改末节点比较方便。

```typescript
/**
指针法
 */
function searchBST(root: TreeNode | null, val: number): TreeNode | null {
    let cur = root;
    while(cur){
        if(val === cur.val) return cur;
        else if(val > cur.val) cur = cur.right;
        else cur = cur.left;
    }
    return null;    // 结束还没return，说明没找到
};
```

#### [538. 把二叉搜索树转换为累加树](https://leetcode.cn/problems/convert-bst-to-greater-tree/)
```typescript
/**
惊奇的发现就是BST逆中序遍历的累和结果
右中左递归遍历，每轮更新node.val = sum;
 */
function convertBST(root: TreeNode | null): TreeNode | null {
    let sum = 0;    // 累和，不能回退，直接用闭包存
    (function traverse(node:TreeNode):void {
        if(!node) return;

        traverse(node.right);
        sum += node.val;
        node.val = sum;
        traverse(node.left);
    })(root);

    return root;
};
```


#### [98. 验证二叉搜索树](https://leetcode.cn/problems/validate-binary-search-tree/)
```typescript
/**
最简单的方法 - 中序遍历看是否是升序数组
 */
function isValidBST(root: TreeNode | null): boolean {
    const arr = [];
    (function inorder(node:TreeNode | null): void {
        if(!node) return;

        inorder(node.left);
        arr.push(node.val);
        inorder(node.right);
    })(root);
    
    return arr.every((num,index)=>{
        if(index > 0){
            return (num > arr[index - 1]); 
        }else return true;
    })
};
```



---

## AVL - 平衡BST
要注意，return后面要用()包裹表达式，否则会返回undefined
#### [110. 平衡二叉树](https://leetcode.cn/problems/balanced-binary-tree/)

```typescript
/**
后序遍历，回溯过程返回高度（自底向上）信息
 */
function isBalanced(root: TreeNode | null): boolean {
    return (
        (function postOrder(node:TreeNode): number{
            if(!node) return 0; // null高度为0
            const left = postOrder(node.left);
            if(left === -1) return -1;
            const right = postOrder(node.right);
            if(right === -1) return -1;
            if(Math.abs(left-right) > 1) return -1;
            return Math.max(left,right) + 1;
        })(root) === -1
        ? false
        : true
    );
};
```


### [669. 修剪二叉搜索树](https://leetcode.cn/problems/trim-a-binary-search-tree/)

```typescript
function trimBST(root: TreeNode | null, low: number, high: number): TreeNode | null {
    if(!root) return null;

    if(root.val < low) return trimBST(root.right,low,high);
    if(root.val > high) return trimBST(root.left,low,high);
    
    root.left = trimBST(root.left,low,high);
    root.right = trimBST(root.right,low,high);

    return root;
};
```


END
<!--ID: 1726850011744-->
