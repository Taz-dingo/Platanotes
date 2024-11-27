---
created: 星期四, 八月 22日 2024, 10:28:44 晚上, 1724336924000
modified: 星期四, 八月 22日 2024, 10:28:44 晚上, 1724336924000
---

DECK: 前端
TAG: 模块化
## UMD (Universal Module Definition)[​](https://febook.hzfe.org/awesome-interview/book1/js-module-specs#24-umd-universal-module-definition "Direct link to 2.4 UMD (Universal Module Definition)")

UMD，即通用模块定义。UMD 主要为了解决 CommonJS 和 AMD 规范下的代码不通用的问题，同时还支持将模块挂载到全局，是**跨平台**的解决方案。

**示例**

```js
// hzfe.js
(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    // AMD
    define(["exports", "hzfe"], factory);
  } else if (
    typeof exports === "object" &&
    typeof exports.nodeName !== "string"
  ) {
    // CommonJS
    factory(exports, require("hzfe"));
  } else {
    // Browser globals
    factory((root.commonJsStrict = {}), root.hzfe);
  }
})(typeof self !== "undefined" ? self : this, function (exports, b) {
  const hzfeMember = 17;
  const getHZFEMember = () => {
    return `HZFE Member: ${hzfeMember}`;
  };

  exports.getHZFEMember = getHZFEMember;
});

// index.js
const hzfe = require("./hzfe.js");
console.log(hzfe.getHZFEMember()); // HZFE Member: 17
```



**使用场景**

UMD 可同时在服务器端和浏览器端使用。

**加载方式**

UMD 加载模块的方式取决于所处的环境，Node.js 同步加载，浏览器端异步加载。

**优缺点**

优点

- 跨平台兼容

缺点

- 代码量稍大


END
<!--ID: 1723193055767-->
