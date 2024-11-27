---
created: 星期五, 九月 13日 2024, 9:57:49 晚上, 1726235869229
modified: 星期五, 九月 13日 2024, 9:57:49 晚上, 1726235869229
---



```js
async function asy1() {
	console.log(1);
	await asy2();
	console.log(2);
}
asy2 = async () => {
	await setTimeout((_)=>{
		Promise.resolve().then((_)=>{
			console.log(3);
		});
		console.log(4);
	},0);
};
asy3 = async () => {
	Promise.resolve().then(() => {
		console.log(6);
	})
};

asy1();
console.log(7);
asy3();
```

await阻塞async函数，在处理上和Promise.resolve()一致，等待解决后把后续代码推入微队列，如果没有代码则推入async函数完成。（可以理解为`Promise.resolve().then(...)`）。但是如果await了一个没有await的async函数，那其实就是同步的！直接完成了

```js
async function asy1() {
	console.log(1);
	await asy2();
	console.log(2);
}
asy2 = async () => {
	await (async () => {
		await (async () => {
			console.log(3);
		})();
		console.log(4);
	})()
};
asy3 = async () => {
	Promise.resolve()
		.then(() => {
			console.log(6);
		})
};

asy1();
console.log(7);
asy3();
```




```js
async function async1() {
    console.log('async1 start')
    await async2()
    console.log('async1 end')
}
async function async2() {
    console.log('async2')
}
console.log('script start')
setTimeout(function() {
    console.log('settimeout')
})
async1()
new Promise(function(resolve) {
    console.log('promise1'); 
    resolve();
}).then(function() {
    console.log('promise2')
})
console.log('script end')
```

