---
created: 星期五, 九月 13日 2024, 9:57:49 晚上, 1726235869229
modified: 星期五, 九月 13日 2024, 9:57:49 晚上, 1726235869229
---

```js
// 小红书笔试
const p = new Promise((resolve, reject) => {
  reject("错误");
})
  .then((data) => {
    console.log(data);
  }, (error) => {
    console.log('a');
  })
  .catch((error) => {
    console.log('b');
  })
  .then((result) => {
    console.log('c');
  });
```

Promise错误传递：
- 在 Promise 调用链上，同一个错误一旦被处理（无论是在 `then` 的第二个回调函数中还是在 `catch` 中），它就不会再被后续的 `catch` 或 `then` 方法处理。
- 这是因为处理错误的回调（`then` 的第二个函数或 `catch`）会返回一个 fulfilled 状态的 Promise，标记着错误已经被处理。
- 后续的 `then` 方法会继续执行，并处理处理后的 Promise 的值，不会再次处理之前的错误。

```js
const first = () =>
	new Promise((resolve, reject) => {
		console.log(3)
		let p = new Promise((resolve, reject) => {
			console.log(7)
			setTimeout(() => {
				console.log(5)
				resolve(6)
			}, 0)
			resolve(1)
		})
		resolve(2)
		p.then((arg) => {
			console.log(arg)
		})
	})
	
first()
	.then((arg) => {
		console.log(arg)
	})
	
console.log(4)
```


```js
setTimeout(() => {
    console.log(1);
});

new Promise((res,rej)=>{
    rej();
    console.log(2);
}).then(()=>{
    console.log(3);
}).catch(()=>{
    console.log(4);
}).then(()=>{
    console.log(5);
})

console.log(6);
```

---

- `new Promise((resolve,reject)=>{...})`就是一个正常的构造函数执行，还是同步的，**只有then是异步**！
- Promise状态一旦被敲定就不能再改变

```js
Promise.resolve().then(() => {
    console.log(0);
    return Promise.resolve(4);
}).then((res) => {
    console.log(res)
})

Promise.resolve().then(() => {
    console.log(1);
}).then(() => {
    console.log(2);
}).then(() => {
    console.log(3);
}).then(() => {
    console.log(5);
}).then(() =>{
    console.log(6);
})
```



```js
// 字节三面
const p = new Promise(reject => {
  reject(1);
})
  .catch(err => {
    console.log(err);
  })
  .then(
    () => {
      console.log(2);
    },
    () => {
      console.log(3);
    }
  );
console.log(p);
```