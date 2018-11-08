// 弹幕假数据先走一波

// value是值 speed速度 time展现的时间
let data = [
    { value: '可是杰伦，听妈妈的话晚点再恋爱吧，结果就嫁不出去了[流泪][流泪]', speed: 1, time: 0, fontSize: 20 },
    { value: '愚人节群发了200条＂我爱你＂收到了199条＂呵呵＂和一句＂妈妈也爱你＂', speed: 0, time: 1, fontSize: 20 },
    { value: '别嫌弃教你妈妈用手机，她曾教你用筷子。', speed: 0, time: 9, fontSize: 20 },
    { value: '高一主题班会放这首歌 台下的语文老师突然就冲出去了 后来跟班长要了歌词 晚自修在讲台上边抄歌词边落泪 她告诉我们其实她想她在外地读书的儿子了 儿子还在身边的时候 经常放这首歌给她听', time: 2 },
    { value: '可是那个小子，歌里却都是满满的正能量，正确的价值观。', time: 13 },
    { value: '周杰棍最具教育意义的一首脍炙人口的歌曲。', time: 8 },
    { value: '自古网上孝子多，可惜你妈不上网。[大哭][大哭]', time: 16 },
    { value: '你真的做到了"大家唱的都是我写的歌"[爱心][强]', time: 1 },
    { value: '听完这首歌给我妈打了个电话', time: 10, fontSize: 28 },
    { value: '现在真的长大了[流泪]', time: 6 },
    { value: '那些年每次拆专辑都很兴奋。', time: 1 },
    { value: '在没版权前先评论', time: 10, speed: 0 },
    { value: '七里香14周年，我只能来这里开心了[大哭]', time: 7 },
    { value: '会好好努力 不辜负您对我的期望', time: 12 }
];

let $ = document.querySelector.bind(document);
let canvas = $('#canvas');
let video = $('#video');

// Barrage类，每个弹幕的实例
class Barrage {
    constructor(obj, ctx) {
        this.value = obj.value;
        this.time = obj.time;
        this.obj = obj;
        this.ctx = ctx;
    }
    init() {
        // 把没有的参数都取一遍
        this.opacity = this.obj.opacity || this.ctx.opacity;
        this.color = this.obj.color || this.ctx.color;
        this.fontSize = this.obj.fontSize || this.ctx.fontSize;
        this.speed = this.obj.speed || this.ctx.speed;
        // 求弹幕的宽度，目的是用来校验当前弹幕是否还需要绘制
        let span = document.createElement('span');
        span.innerHTML = this.value;
        span.style.fontSize = this.fontSize + 'px';
        span.style.position = 'absolute';   // 写成定位就能拿到span的宽了
        document.body.appendChild(span);
        // 记录弹幕有多宽
        this.width = span.clientWidth;
        document.body.removeChild(span);

        // 弹幕出现的位置
        this.x = this.ctx.canvas.width;
        this.y = this.ctx.canvas.height * Math.random();
        // 这里我就设置140px的高度展现弹幕
        // this.y = 100 * Math.random();
        // 防止溢出
        if (this.y < this.fontSize) {
            this.y = this.fontSize
        }
        if (this.y > this.ctx.canvas.height - this.fontSize) {
            this.y = this.ctx.canvas.height - this.fontSize;
        }
    }
    render() {
        // 渲染自己，绘制在画布上
        this.ctx.ctx.font = this.fontSize + 'px "Microsoft Yahei"';
        this.ctx.ctx.fillStyle = this.color;
        this.ctx.ctx.fillText(this.value, this.x, this.y);
    }
}

// 创建一个用canvas绘制的弹幕类
class CanvasBarrage {
    constructor(canvas, video, options = {}) {
        if (!canvas || !video) return;
        // 方便取到，直接挂到this实例上
        this.canvas = canvas;
        this.video = video;
        this.canvas.width = video.clientWidth;
        this.canvas.height = video.clientHeight;
        // 获取画布
        this.ctx = canvas.getContext('2d');

        // 默认选项
        let defaultOptions = {
            speed: 1,
            fontSize: 20,
            color: '#f25d8e',
            opacity: 0.4,
            data: []
        };
        // 把传过来的data和默认选项合并替换
        // 对象的合并 将属性全部挂载到this实例上
        Object.assign(this, defaultOptions, options);

        // 是否开始播放
        // 默认是暂停播放，不渲染弹幕
        this.isPaused = true;
        // 存放所有弹幕，Barrage是创造弹幕的实例的类
        // 在Barrage类里除了数据里的每一项之外，还有那些默认选项也是需要的
        // 所以直接把this传过去
        // 用类的特点主要是方便扩展
        this.barrages = this.data.map(obj => new Barrage(obj, this));
        console.log(this.barrages);
        // 渲染所有的弹幕
        this.render();
    }
    renderBarrage() {
        let time = this.video.currentTime;
        this.barrages.forEach(barrage => {
            // 如果视频当前播放时间大于等于弹幕展现的时间就显示出来
            if (!barrage.flag && time >= barrage.time) {
                // 先去初始化，初始化后再进行绘制
                if (!barrage.isInit) {
                    barrage.init();
                    barrage.isInit = true;
                }
                barrage.x -= barrage.speed;
                barrage.render();    // 渲染自己
                if (barrage.x < -barrage.width) {
                    // 停止渲染的标记
                    barrage.flag = true;
                }
            }
        });
    }
    render() {
        // 第一次先清空画布，再渲染弹幕
        // 要是没有暂停就继续渲染
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.renderBarrage();  // 渲染弹幕
        if (this.isPaused === false) {
            // 递归渲染
            requestAnimationFrame(this.render.bind(this));
        }
    }
    add(obj) {
        this.barrages.push(new Barrage(obj, this));
    }
    reset() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let time = this.video.currentTime;
        this.barrages.forEach(barrage => {
            barrage.flag = false;
            if (time <= barrage.time) {
                // 重新初始化
                barrage.isInit = false;
            } else {
                // 其他弹幕不再渲染
                barrage.flag = true;
            }
        });
    }
}
let canvasBarrage = new CanvasBarrage(canvas, video, { data });

video.addEventListener('play', () => {
    canvasBarrage.isPaused = false;
    canvasBarrage.render();
});
video.addEventListener('pause', () => {
    canvasBarrage.isPaused = true;
});
video.addEventListener('seeked', () => {
    canvasBarrage.reset();
});

$('#add').addEventListener('click', () => {
    let value = $('#text').value;
    let time = video.currentTime;
    let color = $('#color').value;
    let fontSize = $('#range').value;
    let obj = { value, time, color, fontSize };
    // 添加弹幕
    canvasBarrage.add(obj);
    $('#text').value = '';
});