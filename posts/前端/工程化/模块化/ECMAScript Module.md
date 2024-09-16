DECK: 前端
TAG: 模块化
## ESM (ECMAScript Module)[​](https://febook.hzfe.org/awesome-interview/book1/js-module-specs#25-esm-ecmascript-module "Direct link to 2.5 ESM (ECMAScript Module)")

ESM，即 ESModule、ECMAScript Module。官方模块化规范，**现代浏览器原生支持**，通过 `import` 加载模块，`export` 导出内容。 

**示例**

```js
// hzfe.js
const hzfeMember = 17;
export const getHZFEMember = () => {
  return `HZFE Member: ${hzfeMember}`;
};

// index.js
import * as hzfe from "./hzfe.js";
console.log(hzfe.getHZFEMember()); // HZFE Member: 17
```

**使用场景**

ESM 在支持的浏览器环境下可以直接使用，在不支持的端需要编译/打包后使用。

**加载方式**

ESM 加载模块的方式同样取决于所处的环境，Node.js 同步加载，浏览器端异步加载。

**优缺点**

优点

- 支持同步/异步加载
- 语法简单
- 支持模块静态分析
- 支持循环引用

缺点

- 兼容性不佳



END
<!--ID: 1723193055760-->
