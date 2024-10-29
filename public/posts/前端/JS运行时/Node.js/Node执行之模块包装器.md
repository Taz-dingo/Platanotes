前几天晚上在牛客刷到个很好（e）玩（xin）的题目

```js
var num = 1;
var obj = {
    num: 2
};

obj.fn = (function(num) {
    this.num = num * 4;
    num++;
    return function(n) {
        this.num += n;
        num++;
        console.log(num);
    }
})(obj.num);

var fn = obj.fn;
fn(6);
obj.fn(7);
console.log(num);
console.log(obj.num);
// 4 5 14 9
```

这题结果怎么来的不是我想讨论的重点，重点是大家发现好像浏览器执行结果和node执行结果不一致（有人说是4 5 1 9）

![img_v3_02dl_cb7323f6-6211-4ec0-9b04-135a17f83a8g.jpg](https://tazdingo-images.oss-cn-hongkong.aliyuncs.com/tazdingo-imagesimg_v3_02dl_cb7323f6-6211-4ec0-9b04-135a17f83a8g.jpg)


然后我在命令行进入node粘贴代码又测试了一下，咦？你的node我的node好像不一样

![image.png](https://tazdingo-images.oss-cn-hongkong.aliyuncs.com/tazdingo-images20240811004326.png)

后来发现他们打印4 5 1 9的是通过`node file.js`执行的，我试了一下，确实啊，这回是4 5 1 9了

![image.png](https://tazdingo-images.oss-cn-hongkong.aliyuncs.com/tazdingo-images20240811005049.png)

经过一个老哥的分析以及我的调查（GPT，噢不，其实问的是Claude），发现`> node file.js`这种文件执行本质上是CommonJS模块调用，代码外面会包一层[模块包装器](https://www.nodeapp.cn/modules.html#modules_the_module_wrapper)[^1]：

```js
(function(exports, require, module, __filename, __dirname) { 
	// 模块的代码实际上在这里 
});
```

这是有意为之，保持全局作用域的卫生的。

这样的话，文件内代码运行环境就是一个这个“模块包装器函数”的函数作用域了，var出来的num变量自然是属于这个函数作用域了。

好家伙，这回真给我在牛客学到了🤓

---

值得注意的是这样并不影响直接调用函数的this绑定到全局对象上，本来我还想着是不是会绑定到调用函数的作用域上，其实并不会，重温一下普通函数[[2. this#this绑定|this绑定]]四条规则：
new、显式绑定(call、apply、bind)、隐式绑定（通过对象调用）、默认绑定（函数直接执行）

噢，原来并没有“指向调用函数”这种说法，只有“指向调用对象”，所以这份代码大部分都还是正常执行了，this也都能指向全局对象，只有第三个log被这个IIFE包装函数的`var num = 1`给截胡了（如果是命令行执行的话不会出现这个问题）。



[^1]: [模块包装器](https://www.nodeapp.cn/modules.html#modules_the_module_wrapper)