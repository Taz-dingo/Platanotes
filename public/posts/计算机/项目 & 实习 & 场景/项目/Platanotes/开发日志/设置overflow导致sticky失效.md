
```css
body{
	width: 100vw;
	overflow-x: hidden;
	position: absolute;
}
```
这个方法适用于不需要横行滚动的页面

> `100vw`相对于浏览器的`window.innerWidth`，是浏览器的内部宽度，注意，**滚动条宽度也计算在内**！
>——张鑫旭

因为body下的container设置了`mx-auto`来居中