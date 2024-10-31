
TAG: JS
DECK: 前端

## typeof & instanceof

### `typeof`

- **定义**：用于返回一个值的数据类型，返回的是字符串表示的数据类型。
- **用法**：`typeof obj`
- **返回值**：
    - `"object"`：对象（包括 `null`）
    - `"function"`：函数
    - `"number"`, `"string"`, `"boolean"`, `"undefined"` 等：基本数据类型
- **特点**：不依赖原型链，可检测基本类型。对所有非 `null` 对象返回 `"object"`。

### `instanceof`

- **定义**：用于检测对象是否是某个构造函数的实例，检查的是原型链。
- **用法**：`obj instanceof Constructor`
- **返回值**：`true` 或 `false`
- **特点**：基于原型链，适用于同一环境的对象类型检测。不同执行环境（如 `iframe`）间可能失效。


### 判断对象

`obj !== null && typeof obj === 'object'` or `obj instanceof Object`？

- `obj instanceof Object`：适用于大多数情况，但在多环境（iframe、window）下可能失效。
- `obj !== null && typeof obj === 'object'`：更通用且安全，推荐使用这个方法检测对象。

 **不同执行环境的全局对象隔离**
 
在浏览器中，每个 `window` 或 `iframe` 都有自己独立的全局对象。这意味着在不同环境中，像 `Object`、`Array` 等全局构造函数都是不同的实例。

假设你在一个 `iframe` 中创建了一个对象，并在主文档中使用 `instanceof` 来检测它是否是 `Object` 的实例。由于 `iframe` 中的 `Object` 和主文档中的 `Object` 是不同的构造函数，即便这个对象确实是一个普通的对象，`instanceof` 也会返回 `false`。

#### 示例：跨 `iframe` 的 `instanceof` 失效

```js
// 创建一个 iframe
const iframe = document.createElement('iframe');
document.body.appendChild(iframe);

// iframe 中的 Object
const iframeObject = new iframe.contentWindow.Object();

// 在主文档中检查实例
console.log(iframeObject instanceof Object); // false
```

在上面的例子中，`iframeObject` 是在 `iframe` 中创建的对象，虽然它是一个标准的对象，但由于它的 `Object` 构造函数来自 `iframe` 的全局环境，主文档中的 `Object` 和 `iframe` 中的 `Object` 是两个不同的函数。因此，`instanceof Object` 会返回 `false`，因为它们的 `prototype` 并不相同。


END
<!--ID: 1726197350510-->
