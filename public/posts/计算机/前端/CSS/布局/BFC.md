---
created: 星期五, 九月 13日 2024, 11:21:37 上午, 1726197697137
modified: 星期五, 九月 13日 2024, 11:21:37 上午, 1726197697137
---

TAG: JS
DECK: 前端
## BFC

BFC（Block Formatting Context），即块级格式化上下文，形成一个相对于外界完全独立的空间，让内部的子元素不会影响到外部的元素  
  
触发条件：  

- 根元素，即HTML元素
- float非none，比如为left、right
- overflow值不为 visible，为 auto、scroll、hidden
- display的值为inline-block、inltable-cell、table-caption、table、inline-table、flex、inline-flex、grid、inline-grid
- position的值为absolute或fixed

解决问题  

- 垂直margin塌陷
- 子元素浮动导致的父元素高度塌陷
- 自适应多栏布局

END
<!--ID: 1726197528377-->
