

## this、闭包、作用域专区

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
```


```js
var length = 10;

function fn() {
    return this.length + 1;
}
var obj = {
    length: 5,
    test1: function() {
        return fn();
    }
};
obj.test2 = fn; 

console.log(obj.test1()) 
console.log(fn()===obj.test2())

/*
注意fn()是直接在function里调用的，所以属于默认绑定到全局对象
*/
```



```js
function Foo() {
  getName = function () { 
    console.log(1)
  }
  return this
}
Foo.getName = function () {
  console.log(2)
}
Foo.prototype.getName = function () {
  console.log(3)
}
var getName = function () {
  console.log(4)
}
function getName() {
  console.log(5)
}
Foo.getName() // 2 对象属性
getName() // 4 全局getName覆盖 为4
Foo().getName() // 
getName()
new Foo.getName() 
new Foo().getName() 
new new Foo().getName() 
```
- function函数声明也存在提升，是把整个函数体都提升到作用域顶部，要注意var变量覆盖顺序



注意`obj.a()`和`(obj.a)()`都是隐式绑定
```js
// 美团到家一面
const name = "hong";
const obj = {
	name: "ming",
	a(){
		return this.name;
	}
}
console.log(obj.a());
console.log((obj.a)());
```

注意let、const声明的变量不会绑定到全局作用域，var会
```js
// 箭头函数版
const name = "hong";
const obj = {
	name: "ming",
	a:()=>{
		return this.name;
	}
}
const c = obj.a
console.log(obj.a());
console.log((obj.a)());
console.log(c());
```
