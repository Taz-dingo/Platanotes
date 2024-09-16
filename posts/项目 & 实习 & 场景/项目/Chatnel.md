
### OSS分片上传
1. 调用 aliyun-oss SDK 之前获取 STS Token
2. 定义上传分片大小，如果文件小于分片大小则使用普通上传，否则使用分片上传
3. 上传过程中能展示上传进度
4. 上传过程中，如果 STS Token 快过期了，则先暂停上传重新获取 Token，接着进行断点续传
5. 支持手动暂停、续传功能
6. 上传完成后返回文件对应的下载地址
https://blog.csdn.net/zmx729618/article/details/123520915

### webRTC

1. 基于socket.io的信令系统
2. 建立RTC连接
3. 采集媒体流



APP router用不了socket.io的问题：
[Access to server instance](https://github.com/vercel/next.js/discussions/47782)


server socket 
client socket 路径没设置对

