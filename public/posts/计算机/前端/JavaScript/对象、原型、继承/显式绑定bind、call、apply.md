TAG: JS
DECK: 前端
## 显式绑定

`bind`、`call` 和 `apply` 都是 JavaScript 中用于改变函数 `this` 指向的方法，区别在于它们如何传递参数和调用函数：

1. **`call`**：立即调用函数，参数逐个传递。  
   ```js
   function example(a, b) {
     console.log(this.name, a, b);
   }
   example.call({ name: 'Alice' }, 1, 2); // Alice 1 2
   ```

2. **`apply`**：立即调用函数，参数以数组形式传递。  
   ```js
   example.apply({ name: 'Bob' }, [1, 2]); // Bob 1 2
   ```

3. **`bind`**：不立即调用，返回一个新的绑定了 `this` 的函数，参数逐个传递。  
   ```js
   const boundFunc = example.bind({ name: 'Charlie' }, 1);
   boundFunc(2); // Charlie 1 2
   ```

### 区别总结：
- `call` 和 `apply` 都是立即执行，区别在于参数传递方式（逐个 vs 数组）。
- `bind` 返回一个新函数，不立即执行，可以延迟调用并预设部分参数。


END
<!--ID: 1726237506538-->
