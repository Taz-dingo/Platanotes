DECK: 前端
TAG: Webpack
## Webpack Loader
实质是一个转换器，将A文件进行编译形成B文件，操作的是文件。
### Loader配置
1. 配置：`webpack.config.js`直接配
2. 内联：每个import语句里显式指定Loader
3. CLI方式：在shell里指定

```js
module.exports = {
  module: {
    rules: [ // 对象数组，每个对象就是一个Loader配置
      {
        test: /\.css$/, // 匹配规则，一般情况下是正则
        use: [  // 指定对应的Loader
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          },
          { loader: 'sass-loader' }
        ]
      }
    ]
  }
};
```


### 特性

以上述代码为例，在处理`css`模块的时候，`use`属性中配置了三个`loader`分别处理`css`文件

- `loader`支持**链式调用**，顺序为相反的顺序执行。(即上述执行顺序为`sass-loader`、`css-loader`、`style-loader`)
- loader 可以是**同步、异步**的
- loader 运行在 Node.js 中，并且能够执行任何操作，产生额外的任意文件。
- 除了常见的通过 `package.json` 的 `main` 来将一个 npm 模块导出为 loader，还可以在 module.rules 中使用 `loader` 字段直接引用一个模块
- loader可以和plugin配合双打实现奇妙效果。

可以通过 loader 的预处理函数，为 JavaScript 生态系统提供更多能力。
用户现在可以更加灵活地引入细粒度逻辑，例如：压缩、打包、语言翻译和更多其他特性

### 常用loader
- style-loader: 将css添加到DOM的内联样式标签style里
- css-loader :允许将css文件通过require的方式引入，并返回css代码
- less-loader: 处理`less -> css`
- sass-loader: 处理`sass -> css`
- `postcss-loader`: 用`postcss`来处理CSS
	
- autoprefixer-loader: 处理CSS3属性前缀，已被弃用，建议直接使用`postcss`
- file-loader: 分发文件到output目录并返回相对路径
- url-loader: 和file-loader类似，但是当文件小于设定的limit时可以返回一个Data Url
	(可以把小体积图片favicon、小图标等转化成内联base64格式，膨胀一定体积的代价减少http请求)
- html-minify-loader: 压缩HTML
- babel-loader :用babel来转换ES6文件到ES5

END
<!--ID: 1723044521958-->
