---
created: 星期四, 八月 22日 2024, 10:28:44 晚上, 1724336924000
modified: 星期四, 八月 22日 2024, 10:28:44 晚上, 1724336924000
---

TAG: JS
DECK: 前端

## `async` 和 `await` 在事件循环中的处理

`async` 函数

当一个函数被声明为 `async` 时，它会立即返回一个 `Promise`。函数内部的代码会立即执行，直到遇到第一个 `await` 关键字。

`await` 关键字

`await` 关键字用于暂停 `async` 函数的执行，等待一个 `Promise` 的解决。当 `await` 等待的 `Promise` 被解决（fulfilled）或拒绝（rejected）时，`await` 后面的代码会作为一个微任务（micro-task）添加到事件循环中。

  

[https://www.bilibili.com/video/BV1Hu4y1s7oR/?spm_id_from=333.337.search-card.all.click&vd_source=15f80467383329422ad2bb49c134d1b7](https://www.bilibili.com/video/BV1Hu4y1s7oR/?spm_id_from=333.337.search-card.all.click&vd_source=15f80467383329422ad2bb49c134d1b7)


END
<!--ID: 1726237506529-->
