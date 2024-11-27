---
created: 星期四, 十月 17日 2024, 11:02:07 上午, 1729134127281
modified: 星期四, 十月 17日 2024, 11:02:07 上午, 1729134127281
---

then、catch、finally处理器都会创建和返回新的Promise。
```js
const promise = Promise.resolve(42);

promise.then(value=>{
	console.log(value);
}).then(()=>{
	console.log("Finished");
});
```

解链版：
```js
const promise1 = Promise.resolve(42);

const promise2 = promise1.then(value=>{
	console.log(value);
});

promise2.then(()=>{
	console.log("Finished");
})
```

### 捕获错误
链式Promise中的catch()可以感知链中其他Promise抛出的错误，可以利用这种能力起到`try-catch`语句的效果。

**在链式Promise的末端添加一个catch()，可以只用一个catch()处理链式Promise中可能发生的所有错误**：
```js
// 可以处理链式Promise的错误，也可以处理fetch的错误
const promise = fetch("book.json");

promise.then(res => {
	if(res.ok){
		console.log(res.status);
	}else{
		throw new Error('Error');
	}
}).catch(reason => {
	console.error(reason);
})
```


### 链式Promise中使用finally()
一般情况下，`finally()`**复制**（状态和值）并返回上一个Promise；`当finally()`里抛出错误/返回拒绝状态的Promise时，返回拒绝态的Promise。

因此，与`try-catch`不同，`finally()`不适合作为链的最后一环，以防它抛出错误。
```js
// 一个范例
const appElement = document.getElementById("app");
const promise = fetch("books. json");
appElement.classList.add("loading");
promise.then(response => {
    if (response.ok) {
        console.log(response.status);
    } else {
        throw new Error(`Unexpected status code: ${response.status
            } ${response.statusText} `)
    }
}).finally(() => {
    appElement.classList.remove("loading");
}).catch(reason => {
    console.error(reason.message);
});
```

### 从链式Promise中返回值
链式Promise另一个重要能力是将数据从一个Promise传递到下一个Promise。
`then()`和`catch()`都可以，`finally()`不行（当`finally()`只是进行复制的时候）。

```js
const promise = Promise.resolve(42);

promise.then(value => {
	console.log(value);
	return value + 1;
}).then(value => {
	console.log(value); // 43
});
```

```js
const promise = Promise.reject(42);

promise.catch(value => {
	console.error(value);
	return value + 1;
}).then(value => {
	console.log(value); // 43
});
```

### 从链式Promise中返回Promise
同上，`then()`和`catch()`可以返回Promise作为链的下一个Promise，`finally()`返回会被忽略（除非返回一个rejected Promise）。