---
created: 星期四, 八月 29日 2024, 12:57:58 下午, 1724907478000
modified: 星期四, 八月 29日 2024, 12:57:58 下午, 1724907478000
---

TAG: TS
DECK: 前端
## interface和type区别
interface更适合定义对象结构，而type在处理复杂类型时更加灵活。
interface和type在TypeScript中都用于定义类型，但它们有一些重要的区别:

1. 语法和用途:
   - interface主要用于定义对象的结构。
   - type更灵活，可以用于定义各种类型，包括对象、联合类型、交叉类型等。

2. 扩展性:
   - interface可以被多次声明并自动合并。
   - type不能被重复声明。

3. 继承方式:
   - interface使用extends关键字继承。
   - type使用&符号进行交叉。

4. 计算属性:
   - type支持使用in关键字创建映射类型。
   - interface不支持映射类型。

5. 元组和数组:
   - type可以更方便地定义元组和复杂的数组类型。
   - interface在定义数组和元组时较为有限。

例如:
```typescript
// Interface
interface Person {
  name: string;
  age: number;
}

// Type
type PersonType = {
  name: string;
  age: number;
};

// 只能用type定义的联合类型
type Status = "pending" | "approved" | "rejected";

// 只能用type定义的映射类型
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
```



END
<!--ID: 1728357869475-->

