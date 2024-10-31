TAG: React
DECK: 前端

## Concurrent Mode并发模式
React的Concurrent Mode是React团队引入的一项重要特性，旨在提高React应用的响应性和用户体验。以下是Concurrent Mode的一些关键点：
1. 可中断渲染：Concurrent Mode允许React中断正在进行的渲染，以处理更高优先级的更新。这意味着UI可以更快地响应用户输入。
2. 时间切片：React可以将渲染工作分割成小块，在多个帧中完成。这有助于保持应用的流畅性，即使在处理大量数据时也是如此。
3. 优先级：不同的更新可以被赋予不同的优先级。例如，用户输入可以比数据获取有更高的优先级。
4. Suspense：这个特性允许组件"等待"某些条件（如数据加载）被满足后再渲染。
5. useTransition Hook：这个新的Hook允许开发者**标记某些状态更新为非紧急**的，这样React就可以延迟这些更新，优先处理更重要的任务。
6. useDeferredValue Hook：类似于useTransition，但是用于值而不是更新。它可以让你**指定一个值的"过期"版本是可以接受**的。
7. 更好的错误处理：Concurrent Mode提供了更强大的错误边界功能，可以更优雅地处理渲染错误。




END
<!--ID: 1728546911364-->
