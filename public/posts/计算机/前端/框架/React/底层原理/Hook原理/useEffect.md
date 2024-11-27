---
created: 星期二, 九月 3日 2024, 12:32:53 下午, 1725337973000
modified: 星期二, 九月 3日 2024, 12:32:53 下午, 1725337973000
---

## useEffect

### 实现原理
1. 依赖追踪:
    - React会在每次渲染时比较useEffect的依赖数组。
    - 如果依赖发生变化,React会标记这个effect需要在commit阶段执行。
2. 执行时机:
    - 在组件渲染完成后(即DOM更新之后),React会检查哪些effect需要执行。
    - 对于需要执行的effect,React会先运行上一次effect的清理函数(如果有),然后运行新的effect函数。
3. 清理机制:
    - 如果effect返回一个函数,React会将其保存为清理函数。
    - 在下一次effect执行前或组件卸载时,React会调用这个清理函数。
4. 优化:
    - React使用Object.is比较依赖数组中的每一项,以决定是否需要重新执行effect。
    - 空依赖数组([])表示effect只在组件挂载和卸载时执行。



