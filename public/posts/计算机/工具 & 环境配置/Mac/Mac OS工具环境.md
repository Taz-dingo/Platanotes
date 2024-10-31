
## 网络代理
### VPN
- Clash for Windows - 虽然叫for windows，但有mac版

### `Homebrew`设置代理
brew 是用 curl 下载，所以给 curl 设置 socks5 代理即可
```bash
# 一次性，如果要一直代理需要写入~/.zshrc
export ALL_PROXY=socks5://127.0.0.1:1086
```

### GitHub代理

[git_ssh_proxy](https://gist.github.com/chenshengzhi/07e5177b1d97587d5ca0acc0487ad677)
修改 `~/.ssh/config` 文件

```bash
Host github.com
    User git
	Hostname ssh.github.com
	Port 443
    ProxyCommand nc -v -x 127.0.0.1:1086 %h %p
```

## 其他

### 新建文件扩展
App Store下载一个新建文件的扩展，否则建个文件都很麻烦。

### ToDoList
用苹果自己的“提醒事项”结合[[GTD工作流程]]就很好用。


## SSH

### SSH连接主机
https://blog.csdn.net/qq_44773719/article/details/104352965

### 避免每次都要输入SSH密码
[为什么git和远程origin交互的时候ssh每次都要求输入密码?](https://kirito.xyz/2022/09/17/%E4%B8%BA%E4%BB%80%E4%B9%88git%E5%92%8C%E8%BF%9C%E7%A8%8Borigin%E4%BA%A4%E4%BA%92%E7%9A%84%E6%97%B6%E5%80%99ssh%E6%AF%8F%E6%AC%A1%E9%83%BD%E8%A6%81%E6%B1%82%E8%BE%93%E5%85%A5%E5%AF%86%E7%A0%81/)

### shell和ftp工具
Iterms - shell
FileZilla - ftp


