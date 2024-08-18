
## 基于webRTC实现音视频聊天

webRTC建立连接步骤：

1. **创建**一个用于连接控制的 **`RTCPeerConnection` 对象**
2. **采集媒体流**并添加到`RTCPeerConnection` 实例中
3. **建立连接，传输媒体流**。

```js
// 公网中使用
const pc = new RTCPeerConnection({
  iceServers: [
    // 目前我在用的，免费STUN 服务器
    {
      urls: 'stun:stun.voipbuster.com ',
    },
    // 谷歌的好像都失效了，不过你们可以试试
    {
      urls: 'stun:stun.l.google.com:19301',
      // urls: 'stun:stun.l.google.com:19302',
      // urls: 'stun:stun.l.google.com:19303',
      // ...
    },
    // TURN 服务器,这个对服务器压力太大了，目前没找到免费的，后续我在自己的服务器上弄一个
    {
      urls: 'turn:turn.xxxx.org',
      username: 'webrtc',
      credential: 'turnserver',
    },
    {
      urls: 'turn:turn.ap-southeast-1.aliyuncs.com:443?transport=tcp',
      username: 'test',
      credential: 'test',
    },
  ],
})

```





[^1]: [WebRTC 从实战到未来！前端如何实现一个最简单的音视频通话？](https://juejin.cn/post/7165539003465531399#heading-7)