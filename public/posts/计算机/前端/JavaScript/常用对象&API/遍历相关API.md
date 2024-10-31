TAG: JS
DECK: 前端

## 遍历相关API

- **`for...in`**：遍历对象的键名（包括原型链上的），适合对象，不推荐用来遍历数组。
- **`for...of`**：遍历可迭代对象的值（如数组的元素），不能直接用于对象。
	
- **`Object.keys()`**：返回对象的所有键名，结果是一维数组。
- **`Object.values()`**：返回对象的所有键值，结果是一维数组。
	
- `Object.entries()` ：返回对象的键名、键值，结果是二维数组

| 遍历对象**属性**                               | 包含原型链 |     |
| ---------------------------------------- | ----- | --- |
| `for...in`                               | ✅     |     |
| `Object.keys()`                          | ❌     |     |
| `Object.getOwnPropertyNames()`           | ❌     |     |
| `Object.getOwnPropertySymbols()`         | ❌     |     |
| `Object.prototype.hasOwnProperty.call()` | ❌     |     |
| `in` 运算符                                 | ✅     |     |
| `Reflect.has()`（in运算符的函数形式）              | ✅     |     |



```js
// for in配合Object.prototype.hasOwnProperty
for(let key in obj){
	if(obj.hasOwnProperty(key)){
		clone[key] = deepClone(obj[key],map);
	}
}

// 或 Object.keys()配合for of
for(let key of Object.keys(obj)){
	clone[key] = deepClone(obj[key],map);
}
```

END
<!--ID: 1726849882578-->
