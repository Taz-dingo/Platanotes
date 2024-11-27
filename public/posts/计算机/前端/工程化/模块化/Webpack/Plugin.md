---
created: 星期四, 八月 22日 2024, 10:28:44 晚上, 1724336924000
modified: 星期四, 八月 22日 2024, 10:28:44 晚上, 1724336924000
---

DECK: 前端
TAG: Webpack
## Webpack Plugin

>`Plugin`（Plug-in）是一种计算机应用程序，它和主应用程序互相交互，以提供特定的功能，是一种遵循一定规范的应用程序接口编写出来的程序，只能运行在程序规定的系统下，因为其需要调用原纯净系统提供的函数库或者数据。

`webpack`中的`plugin`也是如此，`plugin`赋予其各种灵活的功能，例如打包优化、资源管理、环境变量注入等，它们会运行在 `webpack` 的不同阶段（钩子 / 生命周期），贯穿了`webpack`整个编译周期

### 配置方式

一般情况，通过配置文件导出对象中`plugins`属性传入`new`实例对象。如下所示：

```js
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装
const webpack = require('webpack'); // 访问内置的插件
module.exports = {
  ...
  plugins: [
    new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin({ template: './src/index.html' }),
  ],
};
```

### 特性

其本质是一个具有`apply`方法`javascript`对象

`apply` 方法会被 `webpack compiler`调用，并且在整个编译生命周期都可以访问 `compiler`对象

```js
const pluginName = 'ConsoleLogOnBuildWebpackPlugin';

class ConsoleLogOnBuildWebpackPlugin {
  apply(compiler) {
    compiler.hooks.run.tap(pluginName, (compilation) => {
      console.log('webpack 构建过程开始！');
    });
  }
}

module.exports = ConsoleLogOnBuildWebpackPlugin;
```

`compiler hook` 的 `tap`方法的第一个参数，应是驼峰式命名的插件名称

关于整个编译生命周期钩子，有如下：

- entry-option ：初始化 option
- run
- compile： 真正开始的编译，在创建 compilation 对象之前
- compilation ：生成好了 compilation 对象
- make 从 entry 开始递归分析依赖，准备对每个模块进行 build
- after-compile： 编译 build 过程结束
- emit ：在将内存中 assets 内容写到磁盘文件夹之前
- after-emit ：在将内存中 assets 内容写到磁盘文件夹之后
- done： 完成所有的编译过程
- failed： 编译失败的时候

### 常用plugin
- `HotModuleReplacementPlugin`: 启用模块热替换(Enable Hot Module Replacement - HMR)	
- **`terser-webpack-plugin`**：用于压缩和优化 JavaScript 代码。它是 Webpack 5 的默认压缩插件。
- `LimitChunkCountPlugin`: 设置 chunk 的最小/最大限制，以调节和控制 chunk
- `MinChunkSizePlugin`: 确保 chunk 大小超过指定限制
- `BabelMinifyWebpackPlugin`：使用 babel-minify 进行压缩
- `AggressiveSplittingPlugin`：将原来的 chunk 分成更小的 chunk
- `BannerPlugin`：在每个生成的 chunk 顶部添加 banner
- **`CleanWebpackPlugin`**：在每次构建前清理输出目录，确保旧文件被删除
- `CommonsChunkPlugin`: 提取 chunks 之间共享的通用模块
- `CompressionWebpackPlugin`: 预先准备的资源压缩版本，使用 Content-Encoding 提供访问服务
- `ContextReplacementPlugin`: 重写 require 表达式的推断上下文
- `CopyWebpackPlugin`: 将单个文件或整个目录复制到构建目录
- `DefinePlugin`: 允许在编译时(compile time)配置的全局常量
- `DllPlugin`: 为了极大减少构建时间，进行分离打包
- `EnvironmentPlugin`: DefinePlugin 中 process.env 键的简写方式
- `ExtractTextWebpackPlugin`: 从 bundle 中提取文本（CSS）到单独的文件
- `HtmlWebpackPlugin`: 简单创建 HTML 文件，用于服务器访问
- `I18nWebpackPlugin`: 为 bundle 增加国际化支持
- `IgnorePlugin`: 从 bundle 中排除某些模块
- `NoEmitOnErrorsPlugin`: 在输出阶段时，遇到编译错误跳过
- `NormalModuleReplacementPlugin`: 替换与正则表达式匹配的资源

END
<!--ID: 1723044521941-->

