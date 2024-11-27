---
created: 星期四, 八月 22日 2024, 10:28:44 晚上, 1724336924000
modified: 星期四, 八月 22日 2024, 10:28:44 晚上, 1724336924000
---

TAG: React
DECK: 前端

## useEffect和类组件副作用

```js
useEffect(()=>{}) // -> 每次重新渲染执行 componentDidUpdate()  
  
useEffect(()=>{},[])//  -> 挂载、卸载执行 componentDidMount()、componentWillUnmount  
  
// 至于有依赖项的，就是prevProps、prevState条件判断+componentDidUpdate()。
```

END
<!--ID: 1726633667718-->
