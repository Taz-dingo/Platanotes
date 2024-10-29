
## Promise的resolve、fulfill和reject
> [Promise-objects](https://link.segmentfault.com/?enc=gc8G%2Bzj5oSxUDI37GVGF3g%3D%3D.f8RGwDaEyYH6CGRz6l1Aw004uIyYeDmqBijpLhK8tW2NKK0xtzbpO2ewbF1PqAAS8U7B2jMIVRAEBq8o6ogNK4q%2By1aKc6Q%2F9LXsN15l5B8%3D):
> 
> 	Any Promise object is in one of three mutually exclusive states: fulfilled, rejected, and pending:
> 	
> 	- A promise p is fulfilled if p.then(f, r) will immediately enqueue a Job to call the function f.
> 	- A promise p is rejected if p.then(f, r) will immediately enqueue a Job to call the function r.
> 	- A promise is pending if it is neither fulfilled nor rejected.
> 	
> 	A promise is said to be settled if it is not pending, i.e. if it is either fulfilled or rejected.
> 	
> 	A promise is resolved if it is settled or if it has been “locked in” to match the state of another promise. Attempting to resolve or reject a resolved promise has no effect. A promise is unresolved if it is not resolved. An unresolved promise is always in the pending state. A resolved promise may be pending, fulfilled or rejected.
> 
> Promise 只有三种状态：pending, fulfilled, rejected 。
> 
> fulfilled 和 rejected 统称 settled 。
> 
> resolved 是指，Promise 已经 settled ，或者已经使用另一个 promise (B) 来 resolve 了（此时 Promise 的状态将由 B 来决定，可能 pending、fulfilled、rejected 的任何一种）。
> 
> pending -> resolve方法 -> fulfilled
> 
> 这个是不对的，resolve 只有会是 resolved ，但是不一定是 fulfilled，也不一定最终转换为 fulfilled，有可能最终转变为 rejected 。[^1]

首先，只需要记住Promise只存在三种状态：Pending、fulfilled、rejected（后两者统称settled）。

然后，resolve是Promise的一个静态方法，resolved是指Promise已经settled，或者resolve了另一个Promise，比如`const PromiseA = Promise.resolve(PromiseB)`，此时PromiseA就是resolved，但是不一定为fulfilled，也可能转变为rejected（如果`PromiseB = Promise.rejected()`）。


### then创建一个新Promise什么意思

其实就是then会返回一个新的Promise，如果then执行的回调（不论是前者成功回调，还是后者失败回调）返回新Promise，那么就是返回那个Promise（状态当然也就是那个Promise自己的状态）；如果执行异常，就会捕获异常返回并以此为理由的rejected Promise。

```javascript
// then - rejected情况
new Promise((resolve, reject) => {
  reject('no');
}).then(
  () => {
    console.log("She said yes!");
    return "yes"
  },
  () => {
    console.log("She said no...");
    return "no"
  }
);
```

![image.png](https://tazdingo-images.oss-cn-hongkong.aliyuncs.com/tazdingo-images20240803193734.png)


[^1]: [Promise中的resolved和fulfilled到底什么关系，又或者这只是叫法的问题？](https://segmentfault.com/q/1010000020423077).by [fefe](https://segmentfault.com/u/fefe_5d0b30d7515e7)
