---
created: 星期六, 八月 31日 2024, 5:32:21 下午, 1725096741000
modified: 星期六, 八月 31日 2024, 5:32:21 下午, 1725096741000
---


## new操作符

[实现new操作符](https://www.nowcoder.com/practice/71c2aff7cb6641099aa17d56157a91b9?tab=note) 四件事，不过其实可以用三句话解决

注意`Object.create(myPrototype)`会自动在新创建对象上绑定`constructor`（如果`myPrototype`有`constructor`的话）

```js
const _new = function(fn, ...args) {
	/*
	1. 创建对象
	2. 新对象在原型链上链接上构造函数（不建议用obj.__proto__ = fn.prototype，需要手动绑定constructor，并且__proto__即将废弃）
	3. this绑定到对象上执行构造函数
	4. 如果构造函数没有返回对象，返回新对象
	*/

	const obj = Object.create(fn.prototype); // 1、2
	const res = fn.apply(obj, args); // 3
	return (res !== null && typeof res === 'object') ? res : obj; // 4
}
```

