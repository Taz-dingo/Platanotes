# 更新日志

所有关于 Platanotes 项目的重要更改都将记录在此文件中。

本文档格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
并且本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [未发布]

#### TO DO

- [ ] feat: 添加mermaid解析器
- [ ] feat: 首页设计
- [ ] feat: 还是可以实现一下双链、图链
- [ ] bug: 首屏加载样式闪烁
- [ ] bug: 如果文本内容太短，即时有富余空间，main也不会达到应有的宽度
- [ ] feat: 滑动动态加载，虚拟列表

- [ ] bug: post-tree-node展开收起有问题（深层子级）

- [ ] bug：没有标题的时候ast-list-bar没有对应显示

- [ ] feat: OSS上CDN
- [ ] feat: 图片懒加载、点击放大等等功能

- [ ] refactor: 统一post格式
- [ ] refactor: 统一icon库（现在有lucide-react和react-icons两个））
- [ ] refactor: 统一响应式断点位置（现在有sm和md两个））

- [ ] feat: 404页面

- [ ] feat: 影展，用微前端实现？

- [ ] perf: /categories超级慢，把所有文章都loading+处理了才响应好，而且这玩意为啥没缓存？

### 2024-12-02

- [x] refactor: 组件样式框抽象出来
- [x] bug: 进入具体posts后menu-card选中状态丢失
- [x] feat：引入frame-motion动画

### 2024-12-01

- [x] feat: 侧边栏文字禁止换行
- [x] bug：ast-list-bar选中状态有问题
- [x] feat：滚动时候ast-list-bar同步高亮
- [x] bug: 同名headings会导致跳转不正确
- [x] feat: ast-list-bar添加左border

### 2024-11-29

- [x] feat：不用本地文件，用OSS，通过API动态获取当前页面

### 2024-11-28

- [x] feat: 移动端响应式
- [x] feat: 面包屑正常跳转

### 2024-11-26

- [x] feat: 顶部导航栏
- [x] feat: latest posts从front matter获取
- [x] todo: posts的ctime、etime问题（新文件使用模板；旧文件批处理添加对应字段）
- [x] todo: posts的git自动同步
- [x] refactor: 从阿里云oss获取博客内容

### 2024-11-02

- [x] feat: 目录树为空时显示对应文字

### 2024-11-01

- [x] feat: 面包屑

### 2024-10-31

- [x] feat: latest posts
- [x] bug: sticky失效了

### 2024-10-30

- [x] feat: 右边栏显示文章结构
- [x] feat: 左边栏添加当前页面高亮
- [x] bug: 页面切换抖动
- [x] 左边栏的当前页面添加灰色背景标识

### 2024-10-20

- [x] 把markdown外联样式改为本地样式、修改main背景色
- [x] 暂时取消落叶动画
- [x] sidebar - 去掉高度变化渐变，添加文字渐入渐出；添加sticky
- [x] 修改三栏布局

### 2024-10-01

#### 新增

- 添加自定义字体 LXGW WenKai
- 实现落叶动画效果
- 添加CHANGELOG.md记录更新

#### 更改

- 更新文章目录树组件样式

#### 移除

- 移除未使用的 SVG 文件

## 2024-03-XX

- 初始版本完成
