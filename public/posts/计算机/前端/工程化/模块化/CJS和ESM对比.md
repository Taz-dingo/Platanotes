
## CJS和ESM对比

| 特性            | CommonJS (CJS)                 | ES Modules (ESM)               |
|-----------------|---------------------------------|---------------------------------|
| **导入方式**     | `const module = require('module')` | `import module from 'module';`  |
| **导出方式**     | `module.exports = value`       | `export default value;`         |
| **加载方式**     | 同步加载                        | 异步加载                        |
| **支持环境**     | Node.js                        | 浏览器和 Node.js                |
| **编译时分析**   | 不支持静态分析                | 支持静态分析                    |
| **树摇优化**     | 不支持                         | 支持                           |
| **文件扩展名**   | `.js` (默认)                   | `.js` 或 `.mjs`                |
| **动态导入**     | `require()` 可以动态导入       | `import()` 支持动态导入        |
| **模块作用域**   | 模块内共享全局作用域            | 每个模块都有独立作用域          |

END
<!--ID: 1727575427143-->
