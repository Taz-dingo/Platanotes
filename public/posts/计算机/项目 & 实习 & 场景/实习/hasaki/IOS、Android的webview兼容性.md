## background-attachment: fixed在IOS上失效
把背景固定在body的伪元素上
```jsx
useEffect(() => {
	// IOS下background-attachment: fixed失效，这里用body::before来代替
	const style = document.createElement('style');
	style.innerHTML = `
	body::before {
		content: '';
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: url('https://c-ssl.dtstatic.com/uploads/ops/202403/11/M6SjVVZJsBwlqjE.thumb.1000_0.png') top / 100% no-repeat;
		backgroundColor: rgb(238,210,247);
		z-index: -1; /* Ensure it's behind other content */
	}
	body {
		position: relative; /* Ensure body covers the full viewport */
	}
	`;
	
	document.head.appendChild(style);
	
	return () => {
		document.head.removeChild(style);
	};

}, []);
```


## 早期安卓三大金刚键、iphoneX以后的刘海 - 安全区域
某些安卓手机也识别了`safe-area-inset-*`而且值还为0，这个时候用max()，同时
[关于 env(safe-area-inset-bottom)的适配问题？](https://developers.weixin.qq.com/community/develop/doc/0008a239aa09e8c2db005b9fc6b800)

## 低版本设置了height: 100%无法被子元素撑开

