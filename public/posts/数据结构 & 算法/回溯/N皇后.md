
### [51. N 皇后](https://leetcode.cn/problems/n-queens/)

```typescript
function solveNQueens(n: number): string[][] {
    const res: string[][] = [];
    const board = new Array(n).fill(null).map(() => (new Array(n).fill('.')));

    function isValid(row: number, col: number): boolean {
        for (let i = 0; i < row; i++) {
            if (board[i][col] === 'Q') return false;
            if (board[i][col + (row - i)] === 'Q') return false;
            if (board[i][col - (row - i)] === 'Q') return false;
        }

        return true;
    }

    (function backtrack(row: number = 0) {
        if (row === n) {
	        // map后的其实已经是新数组了
            res.push(board.map((item) => (item.join(""))));
        }

        for (let col = 0; col < n; col++) {
            if (isValid(row, col)) {
                board[row][col] = 'Q';
                backtrack(row + 1);
                board[row][col] = '.';
            }
        }
    })()

    return res;
};
```

