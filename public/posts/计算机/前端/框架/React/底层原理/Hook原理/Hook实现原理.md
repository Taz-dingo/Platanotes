---
created: 星期二, 九月 3日 2024, 12:32:53 下午, 1725337973000
modified: 星期二, 九月 3日 2024, 12:32:53 下午, 1725337973000
---

拷打死我了，今天必须拿下

TAG: React
DECK: 前端

- 每一个 hook 函数都有对应的 hook 对象保存状态信息
- `useContext`是唯一一个不需要添加到 hook 链表的 hook 函数
- 只有 useEffect、useLayoutEffect 以及 useImperativeHandle 这三个 hook 具有副作用，在 render 阶段需要给函数组件 fiber 添加对应的副作用标记。同时这三个 hook 都有对应的 effect 对象保存其状态信息
- 每次渲染都是重新构建 hook 链表以及 收集 effect list(fiber.updateQueue)
- 初次渲染调用 mountWorkInProgressHook 构建 hook 链表。更新渲染调用 updateWorkInProgressHook 构建 hook 链表并复用上一次的 hook 状态信息

## Hooks实现原理

### Hook数据结构

hook的数据是存放在fiber的memoizedState属性的链表上的，每个hook对应一个节点。
不同的 hooks 方法，memoizedState 存储的内容不同，常用的 hooks memoizedState 存储的内容如下：

- useState/useReducer: state
- useEffect: effect 对象
- useMemo/useCallback: callback, deps
- useRef: { current: xxx }

```ts
// packages/react-reconciler/src/ReactFiberHooks.old.js

// hook的结构，挂载在fiber.memoizedState属性上
// 是的，它在fiber身上没有直接叫"hook"😅
export type Hook = { | 
	memoizedState: any, // 上次渲染时所用的 state
    baseState: any, // 已处理的 update 计算出的 state
    baseQueue: Update < any,any > |null, // 未处理的 update 队列（一般是上一轮渲染未完成的 update）
    queue: UpdateQueue < any,any > |null, // 当前出发的 update 队列
    next: Hook | null, // 指向下一个 hook，形成链表结构
|};

```

Update 和 UpdateQueue 是存储 `useState` 的 state 及 `useReducer` 的 reducer 相关内容的数据结构。
每次调用 `setState` 或者 `useReducer` 的 dispatch 时，都会生成一个 Update 类型的对象，并将其添加到 UpdateQueue 队列中。

```ts
// packages/react-reconciler/src/ReactFiberHooks.old.js

type Update < S, A > = {
	|
	lane: Lane, // 优先级
	// reducer 对应要执行的 action
	action: A,
	// 触发 dispatch 时的 reducer
	eagerReducer: ((S, A) => S) | null,
	// 触发 dispatch 时的 state
	eagerState: S | null,
	// 下一个要执行的 Update
	next: Update < S,A > ,
	// react 的优先级权重
	priority ? : ReactPriorityLevel,
	|
};

type UpdateQueue < S, A > = {
	|
	// 当前要触发的 update
	pending: Update < S,A > | null,
	// 存放 dispatchAction.bind() 的值
	dispatch: (A => mixed) | null,
	// 上一次 render 的 reducer
	lastRenderedReducer: ((S, A) => S) | null,
	// 上一次 render 的 state
	lastRenderedState: S | null,
	|
};
```



```ts
// packages/react-reconciler/src/ReactFiberHooks.old.js

export type Effect = {
	|
	tag: HookFlags, // 标记是否有 effect 需要执行
	create: () => (() => void) | void, // 回调函数
	destroy: (() => void) | void, // 销毁时触发的回调
	deps: Array < mixed > | null, // 依赖的数组
	next: Effect, // 下一个要执行的 Effect
	|
};
```


---

```javascript
const App = () => {
	const [num, setNum] = useState(111);
	const ref = useRef(1);
	useEffect(()=>{
		setTimeout(() => {
			setNum(333);
		}, 2000);
	},[]);
	return <div>{num}{ref.current}</div>
}
```

（fiber）对应的memoizedState链表：

![image.png](https://tazdingo-images.oss-cn-hongkong.aliyuncs.com/tazdingo-images20240805222814.png)


### useRef、useCallback、useMemo

第一次执行useXxx的hook会走mountXxx的逻辑来创建hook链表，之后会走updateXxx的逻辑。

useRef、useCallback、useMemo都比较简单，只是mountXxx和updateXxx里的那几行代码。


### useEffect、useLayoutEffect

useEffect 的 hook 在 render 阶段会把 effect 放到 fiber 的 updateQueue 中，这是一个 lastEffect.next 串联的环形链表，然后 commit 阶段会**异步执行**所有 fiber 节点的 updateQueue 中的 effect。

useLayoutEffect 和 useEffect 差不多，区别只是它是在 commit 阶段的 layout 阶段**同步执行**所有 fiber 节点的 updateQueue 中的 effect。

一般不建议用 useLayoutEffect，因为同步逻辑会阻塞渲染。

### useState
useState 同样分为 mountState 和 updateState 两个阶段：

mountState 会返回 state 和 dispatch 函数，dispatch 函数里会记录更新到 hook.queue，然后标记当前 fiber 到根 fiber 的 lane 需要更新，之后调度下次渲染。

再次渲染的时候会执行 updateState，会取出 hook.queue，根据优先级确定最终的 state 返回，这样渲染出的就是最新的结果。

源码：
```javascript
function mountState(initialState) {
  var hook = mountWorkInProgressHook();

  if (typeof initialState === 'function') {
    // $FlowFixMe: Flow doesn't like mixed types
    initialState = initialState();
  }

  hook.memoizedState = hook.baseState = initialState;
  var queue = {
    pending: null,
    interleaved: null,
    lanes: NoLanes,
    dispatch: null,
    lastRenderedReducer: basicStateReducer,
    lastRenderedState: initialState
  };
  hook.queue = queue;
  var dispatch = queue.dispatch = dispatchSetState.bind(null, currentlyRenderingFiber$1, queue);
  return [hook.memoizedState, dispatch];
}
```


### 为什么是自底向上状态更新标记

React 的更新机制可能乍看之下有些反直觉。当我们调用 setState 或 useState 的 dispatch 函数时，React 确实会标记从当前组件到根节点的路径需要更新，而不是直接更新当前组件的子组件。这里有几个关键原因：

1. **自顶向下的一致性**： React 的渲染模型是自顶向下的。当一个组件的状态发生变化时，React 需要确保从这个组件到整个应用的根节点的路径上的所有组件都有机会重新渲染。这是为了保持整个组件树的一致性。
2. **上下文和 Props 的传递**： 父组件的更新可能会影响传递给子组件的 props 或上下文（context）。因此，React 需要从变更的组件开始，一直到根节点，然后再自顶向下地重新渲染，以确保所有可能受影响的组件都得到正确的更新。
3. **调和过程（Reconciliation）**： React 的调和过程是从根节点开始的。通过标记从变更组件到根节点的路径，React 可以在下一次渲染时快速找到需要更新的部分，而不必遍历整个组件树。
4. **批量更新和优化**： React 可能会将多个更新批量处理。通过标记到根节点的路径，React 可以在一次渲染周期内处理多个组件的更新，而不是为每个小的更新都进行一次完整的渲染。
5. **Fiber 架构**： React 的 Fiber 架构允许渲染工作被分割成小的单元并可以被中断。标记到根节点的路径使得 React 可以在任何点暂停和恢复工作，而不会丢失更新的上下文。




[^1]: [搞懂 useState 和 useEffect 的实现原理](https://juejin.cn/post/7203336895887114300?from=search-suggest)
[^2]:[彻底搞懂React-hook链表构建原理](https://www.cnblogs.com/xiatianweidao/p/16802574.html "发布于 2022-10-18 14:53")

END
<!--ID: 1723028240776-->


