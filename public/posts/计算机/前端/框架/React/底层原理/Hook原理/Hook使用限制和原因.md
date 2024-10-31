TAG: React
DECK: 前端
## Hook使用限制和原因

### Hook使用限制

- 不要在 `React` 的循环、条件或嵌套函数中使用；
- `Hooks` 只能在函数组件中使用，不支持类组件。

### 限制原因

为了保证Hook的遍历顺序，要保证顺序是因为每次状态更新时，都会同步遍历同步遍历currentFiber、workInProgressFiber两个Fiber的Hook链表。先通过`updateWorkInProgressHook()`复用上一次的Hook状态，再遍历`queue.pending`上的`updateQueue`（更新）链表计算新状态。

END
<!--ID: 1726633667727-->
