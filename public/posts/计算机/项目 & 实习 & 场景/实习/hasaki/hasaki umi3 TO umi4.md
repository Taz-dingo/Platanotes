---
created: 星期五, 八月 30日 2024, 4:08:52 下午, 1725005332000
modified: 星期五, 八月 30日 2024, 4:08:52 下午, 1725005332000
---

## 过程记录

### 修改依赖
package.json
### 修改启动命令
`umi -> max`

### 修改配置
`/.umirc.ts`
注释掉了一些不再支持的东西

### 升级Node
尝试启动，失败，提示不支持“?.”可选链语法，需要升级node版本
升级node版本 12->14

### 重新安装依赖
再次尝试启动，失败
Cannot find module 'react-refresh'
清空npm缓存，npm install

再再次尝试启动，失败，和上一次一样的结果
删除node_modules、package-lock.json，清空npm缓存，npm install
（应该是没有删除package-lock.json的原因）

### **Tailwind**升级
再再再次尝试启动，成功
但是发现样式都崩坏了
调查发现是tailwind都失效了，对tailwind进行升级

### `antd-mobile-v2`处理
项目比较老，有一些使用到了antd-mobile-v2，升级后不能直接import，按照官方说明，安装v2影子依赖，修改相关import代码

### 处理内部库
公司内部公共包有地方报错，修改后第一次尝试发包

### emotion
发现emotion有问题
出现`css="[object object]"`的问题
~~开头添加`/** @jsxImportSource @emotion/react */`以解决~~
改为配置`babel-preset`来处理
https://emotion.sh/docs/css-prop

### import加载静态资源规则
import图片资源umi报错，看源码发现不允许@后直接加数字（注释写的是禁止引入特定版本）
(使用`github1s`看源码)

### import { connect } from 'dva'
然后发现之前从react redux导入connect的都异常了，需要改为`import from 'dva'`

### 低版本兼容性问题

安卓低版本出现异常：
- JS方面??和?.没有编译为兼容形式；
	配置terser解决https://umijs.org/blog/legacy-browser
	（为什么之前JS没有问题？因为使用的是node12？）
- 部分CSS也出现异常（主要是`background-color`）

`postcssLoader`配置没写对？按照官方[recommended写法](https://github.com/webpack-contrib/postcss-loader#options)，`postcssLoader`配置式、`require`引入式都尝试了，还是不行。
版本太旧了？更新了`postcss-flexbugs-fixes`（published 4 years ago）、`postcss-preset-env`(published 22 days ago)到最新，还是不行。

最后发现是`postcss-preset-env`没配置好。调整`stage: 3 -> stage: 0`，发现样式正常，继续调整测试后稳定配置如下：

```javascript
postcssPresetEnv({

	stage: 2, 
	// stage: 2 - 包括已稳定的特性，这些特性有可能成为标准，但仍可能有一些变化
	
	minimumVendorImplementations: 2, 
	// minimumVendorImplementations: 2 - 包括至少两个主要供应商实现的特性（推荐值）
	
	browsers: 'ie >= 11, chrome >= 30, ios >= 6, safari >= 6, edge >= 8', 
	// 指定浏览器范围，对标targets配置

}),
```

发现测试环境的eruda没有成功打开，原来是之前ejs里的script直接包裹在转移字符里，之前的`\`在字符串转换时变了，无法匹配上正则。

---

## 主要改动
### 依赖改动
升级
- `react 16.12.0 -> 18.3.1` 
- `react-dom 16.12.0 -> 18.3.1` 
- `node 12.18.0 -> 14.21.3` 
- `umi 3.5.0 -> 4.0.0` 
- `tailwind 2.2.17 -> 3.4.4`
- `@duitang/dt-react-mobile 3.3.36 -> 3.3.41`
- `antd-mobile 2.3.3 -> antd-mobile-v2 2.3.4` 
- `react-konva 16.13.0-6 -> 18.2.10`

新增
- `+ dva`
- `+ postcss 8.4.29`
- `+ react-refresh 0.14.2`

移除
- `- @tailwindcss/line-clamp 新版tailwind自带
- `- @umijs/preset-react 新版不需要

移动
`deps -> devDeps`
- `umi`
- `@umijs/plugin-esbuild`
- `@umijs/test`
- `babel-plugin-import`
- `lint-staged`
- `prettier`
- `scss-loader`
- `tailwindcss`
- `@tailwindcss/postcss7-compat`
- `babel-plugin-import`
- `postcss`

脚本
`scripts`里所有的`umi`都换成`max`了

### 代码改动
#### umi相关
1. react-router@6 props一些属性的获取修改（history、location、match等），具体看官方[升级指南](https://umijs.org/docs/introduce/upgrade-to-umi-4)
2. query不再支持了，`location.query -> location.search`。
3. `document.ejs`废弃，相关设置（添加的script、meta等）改到[umi配置](https://v3.umijs.org/zh-CN/config)里添加。
4. connect现在需要从`dva`引入，否则会报错`Could not find "store" in the context(...)` 。具体为`import {connect} from 'react-redux' -> import {connnect} from 'dva'`。
6. `umi4`不允许import正则为`/@\d/`的资源（注释写的是Fixed version import is not allowed），修改图片资源名字`...@2x... ->...@...` ，否则报错`... is not allowed to import.`。

#### emotion和React
1. emotion的`css in js`有时候会出现样式异常，表现为标签里出现`css="[object object]"`，在文件开头加上`/** @jsxImportSource @emotion/react */`以解决，相关[issue](https://github.com/emotion-js/emotion/issues/2752)。

#### `antd-mobile-v2`
1. 现在导入v2的组件要写`'antd-mobile-v2'`，否则会出问题。`import {...} from 'antd-mobile' -> import {...} from 'antd-mobile-v2'`。

#### `dt-react-mobile`
1. 修正了`TrackerIntersection`里contentRef的类型，调用`unobserve`之前加了非空判断，否则新版本会出问题（可能是React18的useEffect会调用两次暴露出来的问题）。

`ninja`
1. 部分使用了`_digy`和`_hmt`的地方修改为`window._digy`和`window._hmt`，否则会报`undefined`。

