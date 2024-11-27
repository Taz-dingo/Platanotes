---
created: 星期四, 八月 22日 2024, 10:28:44 晚上, 1724336924000
modified: 星期四, 八月 22日 2024, 10:28:44 晚上, 1724336924000
---

TAG: CSS
DECK: 前端

## transition、transform

`transition` 和 `transform` 都是用于控制元素视觉效果和动画的 CSS 属性，但它们在功能、作用范围和性能上有所不同。以下是它们的详细对比：


| 特性         | `transition`               | `transform`                    |
| ---------- | -------------------------- | ------------------------------ |
| **功能**     | 控制属性变化的过渡效果                | 用于几何变换（平移、缩放、旋转等）              |
| **主要用途**   | 定义属性值变化时的动画效果              | 改变元素的形状或位置                     |
| **应用范围**   | 任何支持动画的 CSS 属性             | `translate`、`rotate`、`scale` 等 |
| **性能**     | 依赖于属性本身，可能引发重排             | 通过 GPU 加速，性能高效                 |
| **与布局的关系** | 可能影响布局（如 `width`、`height`） | 不影响布局，改变的是视觉效果                 |
| **常用场景**   | 元素属性值变化的动画（颜色、透明度）         | 元素的平移、缩放、旋转等变换效果               |
|            |                            |                                |

---

### 1. **`transition`：过渡效果**
- **作用**：`transition` 是用来定义元素的某些 CSS 属性（如 `width`、`height`、`opacity` 等）如何在属性值发生变化时平滑过渡。
- **用途**：当某个 CSS 属性的值改变时，`transition` 可以让这个变化不是立即生效，而是在指定时间内平滑地从一个值过渡到另一个值。
- **适用属性**：可以作用于大多数 CSS 属性，例如：`background-color`、`width`、`height`、`opacity` 等。
  
- **示例**：
  ```css
  div {
    width: 100px;
    height: 100px;
    background-color: red;
    transition: background-color 0.5s ease;
  }

  div:hover {
    background-color: blue;
  }
  ```
  当鼠标悬停在 `div` 上时，`background-color` 从红色平滑变为蓝色，过渡时间是 0.5 秒。

- **关键点**：
  - 控制的是**属性值**的变化如何平滑进行。
  - 常常与其他属性配合使用，如 `background-color`、`transform` 等。
  - 对性能影响较小，但具体取决于要改变的属性（如布局相关的 `width`、`top` 可能会引起页面的重排）。

---

### 2. **`transform`：变换效果**
- **作用**：`transform` 是用于对元素进行**几何变换**的 CSS 属性，包括平移（`translate`）、缩放（`scale`）、旋转（`rotate`）、倾斜（`skew`）等。它可以改变元素的视觉表现，而不会改变文档流中的布局。
- **用途**：用来对元素的形状、位置进行变换，适合需要动画效果或视觉调整的场景。

- **变换函数**：
  - **`translate(x, y)`**：将元素沿 x 和 y 轴进行平移。
  - **`scale(x, y)`**：缩放元素，`x` 和 `y` 控制水平和垂直缩放比例。
  - **`rotate(angle)`**：旋转元素，`angle` 指定旋转的角度。
  - **`skew(x, y)`**：倾斜元素，`x` 和 `y` 控制水平和垂直方向的倾斜角度。

- **示例**：
  ```css
  div {
    width: 100px;
    height: 100px;
    background-color: red;
    transform: translateX(50px) scale(1.5) rotate(45deg);
  }
  ```
  这个例子中，`div` 元素会平移 50 像素、放大 1.5 倍并旋转 45 度。

- **关键点**：
  - 控制元素的几何变换，不会影响其他元素的布局。
  - 适用于位移、缩放、旋转等动画效果。
  - 通过 GPU 加速，性能优于直接操作 `top`、`left` 等布局属性。


### **性能优化**
- 使用 `transform` 和 `translate` 进行动画时，浏览器会利用 GPU 加速进行渲染，性能优于直接使用 `top`、`left` 等 CSS 布局属性进行位移动画。
- 使用 `transition` 控制 `transform` 中的变换函数（如 `translate`）来实现动画，可以获得平滑的动画效果且不会对布局产生影响。

### 例子：结合使用 `transition` 和 `transform`
```css
div {
  width: 100px;
  height: 100px;
  background-color: red;
  transition: transform 0.5s ease-in-out;
}

div:hover {
  transform: translateX(100px) scale(1.2);
}
```
当鼠标悬停时，`div` 会向右移动 100 像素，并且放大到原来的 1.2 倍，过渡动画持续 0.5 秒。这是通过 `transition` 控制 `transform` 进行的变换。


END
<!--ID: 1726849882615-->
