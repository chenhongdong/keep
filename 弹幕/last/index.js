let data = [
    {value: '周杰伦的听妈妈的话，让我反复循环再循环', time: 5, color: 'red', speed: 1, fontSize: 22},
    {value: '想快快长大，才能保护她', time: 10, color: '#00a1f5', speed: 1, fontSize: 30},
    {value: '听妈妈的话吧，晚点再恋爱吧！爱呢？', time: 15},
];

// 获取到所有需要的dom元素
let doc = document;
let canvas = doc.getElementById('canvas');
let video = doc.getElementById('video');
let text = doc.getElementById('text');
let btn = doc.getElementById('btn');
let color = doc.getElementById('color');
let fontSize = doc.getElementById('range');

// 创建CanvasBarrage类，主要用做canvas来渲染整个弹幕
class CanvasBarrage {
    constructor(canvas, video, opts = {}) {
        // 如果canvas和video都没传，那就直接return掉
        if (!canvas || !video) return;
        // 直接挂到this上
        this.video = video;
        this.canvas = canvas;
        // 给canvas画布设置和video宽高一致
        this.canvas.width = video.width;
        this.canvas.height = video.height;
        // 获取画布
        this.ctx = canvas.getContext('2d');

        // 设置默认参数
        let defOpts = {
            color: '#e91e63',
        }

        // 添加个属性，用来判断播放状态，默认是true暂停
        this.isPaused = true;   
        // 得到所有的弹幕消息


    }
}
// 创建CanvasBarrage实例
let canvasBarrage = new canvasBarrage(canvas, video, { data });