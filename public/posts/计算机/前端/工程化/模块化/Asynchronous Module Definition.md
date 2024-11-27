---
created: 星期四, 八月 22日 2024, 10:28:44 晚上, 1724336924000
modified: 星期四, 八月 22日 2024, 10:28:44 晚上, 1724336924000
---

DECK: 前端
TAG: 模块化
##  AMD (Asynchronous Module Definition)[​](https://febook.hzfe.org/awesome-interview/book1/js-module-specs#22-amd-asynchronous-module-definition "Direct link to 2.2 AMD (Asynchronous Module Definition)")

AMD，即异步模块定义。AMD 定义了一套 JavaScript 模块依赖异步加载标准，用来解决浏览器端模块加载的问题。AMD 主要是**浏览器端**使用，通过 `define` 定义模块和依赖，`require` **异步**加载模块，推崇**依赖前置**。

AMD 模块通过 `define` 函数定义在闭包中：

```js
/**
 * define
 * @param id 模块名
 * @param dependencies 依赖列表
 * @param factory 模块的具体内容/具体实现
 */
define(id?: string, dependencies?: string[], factory: Function | Object);
```

**示例**

```js
// hzfe.js
define("hzfe", [], function () {
  const hzfeMember = 17;
  const getHZFEMember = () => {
    return `HZFE Member: ${hzfeMember}`;
  };

  return {
    getHZFEMember,
  };
});

// index.js
require(["hzfe"], function (hzfe) {
  // 依赖前置
  console.log(hzfe.getHZFEMember()); // HZFE Member: 17
});
```

**使用场景**

AMD 主要在**浏览器端**中使用，通过符合 AMD 标准的 JavaScript 库（如：RequireJs）加载模块。

**加载方式**

AMD 通过**异步**的方式加载模块，每加载一个模块实际就是加载对应的 JS 文件。

**优缺点**

优点

- 依赖**异步加载**，更快的启动速度
- 支持循环依赖
- 支持插件

缺点

- 语法相对复杂
- 依赖加载器
- 难以支持模块静态分析

**具体实现**

- [RequireJs](https://requirejs.org/)



END
<!--ID: 1723134263288-->

