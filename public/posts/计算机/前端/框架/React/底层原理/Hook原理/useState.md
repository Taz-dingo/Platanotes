TAG: React
DECK: 前端
## useState 的工作流程

1. **组件首次渲染 (Mount)** 
	a. React 创建组件的 fiber 节点 
	b. 执行函数组件代码 
	c. 遇到 useState 调用,执行 mountState:
    - 创建 hook 对象并添加到 fiber.memoizedState 链表
    - 初始化 state 值
    - 创建 dispatch 函数 (用于后续更新) d. 返回初始 state 和 dispatch 函数 e. 组件渲染完成,将结果提交到 DOM

2. **状态更新触发 (Update)** 
	a. 用户操作或其他因素调用 setState (通过 dispatch 函数) 
	b. 创建 Update 对象 
	c. 将 Update 对象加入 fiber.updateQueue.pending (环形链表) 
	d. 标记 fiber 节点需要更新 (设置 lanes) e. 调度更新 (通过 Scheduler)
	
3. **调度过程** 
	a. Scheduler 根据优先级安排更新 
	b. workLoop 持续检查是否有可执行的任务 
	c. 当前更新任务被选中执行
	
4. **组件重新渲染** 
	 a. 再次执行函数组件代码 
	 b. 遇到 useState,这次执行 updateState:
    - 从 hook.queue 中获取所有 Update
    - 根据优先级处理 Update,计算最新的 state 值 
	 c. 返回最新的 state 值和 dispatch 函数 
	 d. 组件使用新的 state 值完成渲染
	 
5. **Reconciliation（协调）** 
	a. React 比较新旧虚拟 DOM 树 
	b. 标识需要更新的 DOM 节点
	
6. **Commit 阶段** 
	a. React 将变更应用到实际的 DOM 
	b. 调用相关的生命周期方法或 hooks (如 useEffect)
	
7. **完成渲染**
    - 更新后的 UI 呈现给用户

## 优化机制

- **批量更新**: 多个 setState 调用可能在一次渲染周期内被合并
- **优先级调度**: 通过 lanes 机制,不同的更新可能有不同的优先级
- **Concurrent Mode**: 在支持的情况下,可以中断和恢复渲染过程,提高应用响应性

END
<!--ID: 1723557816941-->
