---
created: 星期四, 八月 22日 2024, 10:28:44 晚上, 1724336924000
modified: 星期四, 八月 22日 2024, 10:28:44 晚上, 1724336924000
---

## 热更新Hot Module Replacement

`HMR`全称 `Hot Module Replacement`，可以理解为模块热替换，指在应用程序运行过程中，替换、添加、删除模块，而无需重新刷新整个应用。

没有HMR页面会整体刷新，一方面加载慢；另一方面会丢失状态信息。


### 开启热更新

在`webpack`中配置开启热模块非常简单，如下代码：

```js
const webpack = require('webpack')
module.exports = {
  // ...
  devServer: {
    // 开启 HMR 特性
    hot: true
    // hotOnly: true
  }
}
```

但是`HMR`并不像 `Webpack` 的其他特性一样可以开箱即用，需要有一些额外的操作。我们需要去指定哪些模块发生更新时进行`HRM`，如下代码：

```js
if(module.hot){
    module.hot.accept('./util.js',()=>{
        console.log("util.js更新了")
    })
}
```

### 实现原理

![image.png](https://tazdingo-images.oss-cn-hongkong.aliyuncs.com/tazdingo-images20240807173545.png)
