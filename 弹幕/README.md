### 提供弹幕数据
弹幕的数据用数组来存

### 创建一个CanvasBarrage类
```
class CanvasBarrage {
    constructor(canvas, video, options = {}) {
        // 如果都没传的话，就没有然后了，亲
        if (!canvas || !video) return;
        // 除了value和time之外，其他如果没有的话
        // 来设置个默认参数
        let defaultOptions = {
            speed: 2,
            color: 'red',
            fontSize: 20,
            opacity: 0.3,
            data: []
        };
        // 合并对象，把参数挂载到this实例上
        Object.assign(this, defaultOptions, options);
    }
}
// 创建一个CanvasBarrage实例
let canvasBarrage = new CanvasBarrage(canvas, video, { data });
```

### 启动redis服务
首先需要安装一下，windows系统下载地址
进入安装好的redis服务端目录
```
// windows系统在命令行里执行
redis-server.exe redis.windows.conf
```