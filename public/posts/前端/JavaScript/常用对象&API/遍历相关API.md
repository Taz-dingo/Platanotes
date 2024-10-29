
- **`for...in`**：遍历对象的键名（包括继承的），适合对象，不推荐用来遍历数组。
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
