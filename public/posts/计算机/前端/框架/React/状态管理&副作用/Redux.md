---
created: 星期四, 八月 22日 2024, 10:28:44 晚上, 1724336924000
modified: 星期四, 八月 22日 2024, 10:28:44 晚上, 1724336924000
---


TAG: React
DECK: 前端
## Redux

Redux 是一个用于 JavaScript 应用程序的可预测状态容器，它遵循三个基本原则：

1. **单一数据源**：整个应用的状态被存储在一个单一的、不可变的 state 对象树中。
2. **状态只读**：唯一改变 state 的方法是触发 actions，actions 是一个描述发生什么的对象。
3. **使用纯函数来执行修改**：为了描述 actions 如何改变 state，你需要编写 reducers，reducers 是接受当前状态和 action，并返回新状态的纯函数。

Redux 的运作流程大致如下：

- **Store**：保存应用的状态，可以订阅和分发状态。
- **Actions**：描述了状态如何变化，是一个普通的对象。
- **Reducers**：传入当前状态和action对象，根据 action 来返回新的状态。
- **Dispatch**：触发 action 并通知所有订阅者状态已更新。

```js

// Action Types  
const INCREMENT = 'INCREMENT';  
const DECREMENT = 'DECREMENT';  
  
// Action Creators  
function increment() {  
  return { type: INCREMENT };  
}  
  
function decrement() {  
  return { type: DECREMENT };  
}  
  
// Initial State  
const initialState = {  
  counter: 0  
};  
  
// Reducer  
function counterReducer(state = initialState, action) {  
  switch (action.type) {  
    case INCREMENT:  
      return { ...state, counter: state.counter + 1 };  
    case DECREMENT:  
      return { ...state, counter: state.counter - 1 };  
    default:  
      return state;  
  }  
}  
  
// Creating the Redux Store  
import { createStore } from 'redux';  
  
const store = createStore(counterReducer);  
  
// Subscribing to the store updates  
store.subscribe(() => {  
  console.log(store.getState());  
});  
  
// Dispatching actions  
store.dispatch(increment()); // { counter: 1 }  
store.dispatch(increment()); // { counter: 2 }  
store.dispatch(decrement()); // { counter: 1 }
```


END
<!--ID: 1726633667722-->
