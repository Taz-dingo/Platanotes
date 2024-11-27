---
created: 星期四, 八月 22日 2024, 10:28:44 晚上, 1724336924000
modified: 星期四, 八月 22日 2024, 10:28:44 晚上, 1724336924000
---

TAG: JS
DECK: 前端
## 继承

- 组合式（原型链继承 + 构造函数继承）
- 寄生式
- 寄生组合式（ES6 class的实现，babel转ES5就是这样处理）


### 组合式继承
就是构造函数继承（其实就是调用一次构造函数）+原型链继承（就是把原型链接上）

```javascript
function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function() {
  console.log(`${this.name} makes a sound.`);
};

function Dog(name) {
  Animal.call(this, name); // 构造函数继承
}

// Dog.prototype = new Animal(); 或者这样写
Dog.prototype = Object.create(Animal.prototype); // 原型链继承
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
  console.log(`${this.name} barks.`);
};
```

## 寄生继承
就是在一个工厂函数里，创建一个增强对象并返回

```javascript
let parent5 = {
    name: "parent5",
    friends: ["p1", "p2", "p3"],
    getName: function() {
        return this.name;
    }
};

function clone(original) {
    let clone = Object.create(original);
    clone.getFriends = function() {
        return this.friends;
    };
    return clone;
}

let person5 = clone(parent5);

console.log(person5.getName()); // parent5
console.log(person5.getFriends()); // ["p1", "p2", "p3"]
```


## 寄生组合式
主要解决`Object.create()`的浅拷贝问题，ES6 class就是用的这种方式
```javascript
function clone (parent, child) {
    // 这里改用 Object.create 就可以减少组合继承中多进行一次构造的过程
    child.prototype = Object.create(parent.prototype);
    child.prototype.constructor = child;
}

// ----准备Parent---------
function Parent6() {
    this.name = 'parent6';
    this.play = [1, 2, 3];
}
Parent6.prototype.getName = function () {
    return this.name;
}
// ----------------------

function Child6() {
    Parent6.call(this);
    this.friends = 'child5';
}

clone(Parent6, Child6);

Child6.prototype.getFriends = function () {
    return this.friends;
}

let person6 = new Child6();
console.log(person6); //{friends:"child5",name:"child5",play:[1,2,3],__proto__:Parent6}
console.log(person6.getName()); // parent6
console.log(person6.getFriends()); // child5
```

END
<!--ID: 1723386759583-->

