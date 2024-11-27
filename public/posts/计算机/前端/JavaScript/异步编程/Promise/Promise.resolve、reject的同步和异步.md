---
created: 星期四, 八月 22日 2024, 10:28:44 晚上, 1724336924000
modified: 星期四, 八月 22日 2024, 10:28:44 晚上, 1724336924000
---

TAG: JS
DECK: 前端
## Promise.resolve / reject的同步和异步

记得之前查资料说Promise.resolve()和Promise.reject()都是同步立即返回新的Promise对象，深以为然。但是今天用try-catch测试的时候发现表现不似预期。

```js
try{
    Promise.reject("no");
}catch(e){
	console.log("catched:",e) 
}
// 捕捉不到
```

```js
(async function(){
    try{
		await Promise.reject("no");
	}catch(e){
		 console.log("catched:",e) 
	}
})()
// catched: no
// 可以捕捉
```

诶？咋回事，说好的同步呢？

再捕捉新Promise试一下，发现新Promise确实是同步立即返回的呀

```js
console.log(
	"catched",
	(() =>{
	    setTimeout(() =>("hi"))
	})()
)
// catched undefined
// 异步内容无法捕捉到
```

```js
console.log(
	"catched",
	Promise.resolve("hi")
)
// catched Promise {<fulfilled>: 'hi'}
// 但是Promise.resolve()返回的新Promise可以捕捉到，说明也确实不是异步的
```

咋回事呢？

问GPT，恍然大悟

---

GPT4o mini：

关键在于理解“立即返回”和“异步处理”的区别：

1. **立即返回的 Promise 对象**：
   - 当你调用 `Promise.resolve(value)` 或 `Promise.reject(reason)` 时，函数会立即返回一个 Promise 对象。这个 Promise 对象的状态是“已解决”或“已拒绝”，取决于你调用的是 `resolve` 还是 `reject`。

2. **异步处理**：
   - 尽管 `Promise.resolve` 和 `Promise.reject` 是同步的（即它们会立即返回一个 Promise 对象），但是 Promise 对象的处理（如执行 `.then`、`.catch` 或 `await`）是异步的。
   - 这意味着，即使你同步地创建了一个已拒绝的 Promise，实际上，处理这个拒绝（如调用 `.catch` 或在 `async` 函数中用 `await`）会被放在微任务队列中，稍后执行。

例如：
```javascript
console.log('Start');

Promise.reject('Error occurred')
  .catch(error => {
    console.log('Caught error:', error);
  });

console.log('End');
```

输出将是：
```
Start
End
Caught error: Error occurred
```

在这个例子中：
- `Promise.reject` 是同步的，立即返回一个拒绝的 Promise 对象。
- 但是，`.catch` 的回调函数不会立即执行，它会在当前任务（即 `console.log('End')`）完成后，进入微任务队列并执行。这就是为什么“Caught error”在“End”之后才出现的原因。

这表明，即使 Promise 对象是立即创建的，其内部的处理（比如 `catch` 或 `then`）还是在事件循环的微任务阶段进行的，所以可以理解为 Promise 的处理是异步的。

---

总结一下：

1. Promise.resolve() / reject()同步立即返回settled状态的对象。
2. 但是由于回调本质上都是`.then`处理（`.catch`也是`.then`的一部分），而`.then`是异步的，所以对应的回调还是异步的。


END
<!--ID: 1723297574424-->
