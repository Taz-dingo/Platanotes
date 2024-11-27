---
created: 星期四, 八月 29日 2024, 12:57:58 下午, 1724907478000
modified: 星期四, 八月 29日 2024, 12:57:58 下午, 1724907478000
---

TAG: TS
DECK: 前端
## TS范型
TypeScript 提供了多种范型（泛型）工具来帮助你创建灵活且可重用的代码。以下是一些常用的 TypeScript 泛型工具：

### 1. **基本泛型**
- 泛型函数：可以为函数参数和返回值指定类型。
  ```ts
  function identity<T>(arg: T): T {
    return arg;
  }
  ```
- 泛型接口：定义接口时使用泛型来表示某些属性类型。
  ```ts
  interface Box<T> {
    value: T;
  }
  ```
- 泛型类：类的属性和方法可以依赖泛型。
  ```ts
  class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
  }
  ```

### 2. **条件类型 (Conditional Types)**
用于基于条件进行类型选择。
```ts
type IsString<T> = T extends string ? true : false;
```

### 3. **映射类型 (Mapped Types)**
可以根据已有类型生成新类型。
```ts
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
```

### 4. **键入查询 (Keyof)**
`keyof` 操作符可以获取某个对象的键组成的联合类型。
```ts
type Keys = keyof { name: string; age: number }; // 'name' | 'age'
```

### 5. **Indexed Access Types**
通过类型来获取对象中的某个属性类型。
```ts
type Person = { name: string; age: number };
type NameType = Person['name']; // string
```

### 6. **Partial、Required 和 Readonly**
用于转换对象类型的工具类型：
- `Partial<T>`：将所有属性变为可选。
- `Required<T>`：将所有属性变为必填。
- `Readonly<T>`：将所有属性变为只读。

```ts
type PartialPerson = Partial<{ name: string; age: number }>;
type RequiredPerson = Required<{ name?: string; age?: number }>;
type ReadonlyPerson = Readonly<{ name: string; age: number }>;
```

### 7. **Record**
创建一个指定键类型和值类型的对象类型。
```ts
type Record<K extends keyof any, T> = {
  [P in K]: T;
};
type UserRoles = Record<'admin' | 'user', boolean>;
```

### 8. **Pick 和 Omit**
- `Pick<T, K>`：从类型 `T` 中选择某些属性 `K`。
- `Omit<T, K>`：从类型 `T` 中排除某些属性 `K`。

```ts
type User = { name: string; age: number; address: string };
type UserNameAndAge = Pick<User, 'name' | 'age'>;
type UserWithoutAddress = Omit<User, 'address'>;
```

### 9. **Exclude、Extract、NonNullable**
- `Exclude<T, U>`：从类型 `T` 中排除与类型 `U` 的交集。
- `Extract<T, U>`：从类型 `T` 中提取与类型 `U` 的交集。
- `NonNullable<T>`：排除类型 `T` 中的 `null` 和 `undefined`。

```ts
type T = Exclude<'a' | 'b' | 'c', 'a'>; // 'b' | 'c'
type U = Extract<'a' | 'b' | 'c', 'a' | 'd'>; // 'a'
type V = NonNullable<string | number | undefined>; // string | number
```

### 10. **ReturnType 和 Parameters**
- `ReturnType<T>`：获取函数类型 `T` 的返回值类型。
- `Parameters<T>`：获取函数类型 `T` 的参数类型元组。

```ts
function foo(x: number, y: string): boolean {
  return x > 0;
}
type FooReturnType = ReturnType<typeof foo>; // boolean
type FooParameters = Parameters<typeof foo>; // [number, string]
```

这些是 TypeScript 中常用的一些范型工具，能够有效增强类型的灵活性和代码的可复用性。


END
<!--ID: 1728546720306-->
