
TAG: ES6
DECK: 前端
## let、const及其特性
1. 变量创建和var一样提升，但是在声明语句前属于**暂时性死区**，不可以操作。
2. 块级作用域，且在**全局作用域用声明也不会变成全局对象的属性**。
3. 统一作用域下**不允许重复声明**。
4. let和var可以修改值。

---

### 1. 变量提升（Hoisting）与暂时性死区（Temporal Dead Zone, TDZ）
- **`var`**:
  - **变量提升**：`var` 声明的变量会被提升到当前作用域的顶部。这意味着在声明之前，可以访问该变量，但值为 `undefined`。
  - 例子：
    ```javascript
    console.log(a); // undefined
    var a = 10;
    ```

- **`let` 和 `const`**:
  - **变量提升**：`let` 和 `const` 也会发生提升，但与 `var` 不同，它们在初始化之前是不可访问的。这种现象被称为**暂时性死区**（TDZ）。在 TDZ 中访问会抛出 `ReferenceError`。
  - 例子：
    ```javascript
    console.log(b); // ReferenceError: Cannot access 'b' before initialization
    let b = 10;
    ```

### 2. 块级作用域（Block Scope）
- **`var`**:
  - `var` 声明的变量是**函数作用域**或**全局作用域**的，不受块级作用域限制。因此在 `if` 或 `for` 语句块内声明的 `var` 变量，可以在块外访问。
  - 例子：
    ```javascript
    if (true) {
      var c = 10;
    }
    console.log(c); // 10
    ```

- **`let` 和 `const`**:
  - `let` 和 `const` 都是**块级作用域**的，意味着它们在声明的块级作用域之外是不可访问的。
  - 例子：
    ```javascript
    if (true) {
      let d = 20;
      const e = 30;
    }
    console.log(d); // ReferenceError: d is not defined
    console.log(e); // ReferenceError: e is not defined
    ```

一个经典例子是，var变量在for迭代里是同一个作用域同一个变量，异步时结果不似预期；let变量块作用域每个都不同
```js
for(var i = 0; i < 10; i++) {
    setTimeout(function() {
        console.log(i);
    }, 0);
}
// 全9

for (let i = 0; i < 10; i++) {
    setTimeout(function() {
        console.log(i);
    }, 0);
}
// 0-9
```


### 3. 重复声明
- **`var`**:
  - `var` 允许在同一个作用域内重复声明同名变量，且不会抛出错误。重复声明的变量仍然会被提升，值将根据最后的声明赋值。
  - 例子：
    ```javascript
    var f = 40;
    var f = 50;
    console.log(f); // 50
    ```

- **`let` 和 `const`**:
  - `let` 和 `const` 不允许在同一个作用域内重复声明同名变量。如果尝试重复声明，会抛出 `SyntaxError`。
  - 例子：
    ```javascript
    let g = 60;
    let g = 70; // SyntaxError: Identifier 'g' has already been declared

    const h = 80;
    const h = 90; // SyntaxError: Identifier 'h' has already been declared
    ```

### 4. 修改声明的变量
var、let可以，const不可以（但如果是引用对象，可以修改属性）


### 总结
| 特性       | `var`               | `let`     | `const`             |
| -------- | ------------------- | --------- | ------------------- |
| **变量提升** | 是（初始化为 `undefined`） | 是（有暂时性死区） | 是（有暂时性死区）           |
| **作用域**  | 函数或全局作用域            | 块级作用域     | 块级作用域               |
| **重复声明** | 允许                  | 不允许       | 不允许                 |
| **修改变量** | 允许                  | 允许        | 不允许（除非是对象/数组的属性或元素） |

`var` 适用于旧代码或兼容性要求较高的场景，`let` 用于可变且在块级作用域内的变量，`const` 则用于不可变的值或不需要重新赋值的对象和数组。

P.S.
- function函数声明也存在提升，且是带着函数体一整个提升。
- function和var都可以重复声明、覆盖，且可以相互覆盖。

END
<!--ID: 1726214410712-->
