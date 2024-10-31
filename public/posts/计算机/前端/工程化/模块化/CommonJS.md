DECK: 前端
TAG: 模块化
## CommonJS
CommonJS 主要是 **Node.js** 使用，通过 `require` **同步**加载模块，`exports` 导出内容。在 CommonJS 规范下，每一个 JS 文件都是独立的模块，每个模块都有独立的作用域，模块里的本地变量都是私有的。

**示例**
```js
// hzfe.js
const hzfeMember = 17;
const getHZFEMember = () => {
  return `HZFE Member: ${hzfeMember}`;
};
module.exports.getHZFEMember = getHZFEMember;

// index.js
const hzfe = require("./hzfe.js");
console.log(hzfe.getHZFEMember()); // HZFE Member: 17
```

**使用场景**

CommonJS 主要在服务端（如：Node.js）使用，也可通过打包工具打包之后在浏览器端使用。

**加载方式**

CommonJS 通过同步的方式加载模块，首次加载会缓存结果，后续加载则是直接读取缓存结果。

**优缺点**

优点

- 简单易用
- 可以在任意位置 `require` 模块
- 支持循环依赖

缺点

- 同步的加载方式不适用于浏览器端
- 浏览器端使用需要打包
- 难以支持模块静态分析



END
<!--ID: 1723134135895-->

