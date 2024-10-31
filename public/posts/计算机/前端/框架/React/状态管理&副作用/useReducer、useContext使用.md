TAG: React
DECK: 前端
## useReducer、useContext

Reducer：  
为什么称之为 reducer? 它实际上是以数组上的 [`reduce()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) 方法命名的。  
  

`reduce()` 允许你将数组中的多个值 “累加” 成一个值：
```js
const arr = [1, 2, 3, 4, 5];

const sum = arr.reduce(  
	(result, number) => result + number  
); // 1 + 2 + 3 + 4 + 5
```

你传递给 `reduce` 的函数被称为 “reducer”。它**接受** **`目前的结果` 和 `当前的值`**，**然后返回** **`下一个结果`**。React 中的 `reducer` 和这个是一样的：它们都**接受** **`目前的状态` 和 `action` ，然后返回 `下一个状态`**。这样，action 会随着时间推移累积到状态中。  

Context
1. 创建context - const MyContext = React.createContext(defaultValue);  
2. 使用<Context.Provider value={...}></...>包裹子组件
3. （函数组件中）使用useContext访问context值



END
<!--ID: 1726633667714-->


