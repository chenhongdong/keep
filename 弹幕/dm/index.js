let $ = document.querySelector.bind(document);
let canvas = $('#canvas');
let video = $('#video');

let canvasBarrage;
let ws = new WebSocket('ws://localhost:2000');

class Barrage {
    constructor(obj, ctx) {
        this.value = obj.value;
        this.time = obj.time;
        this.obj = obj;
        this.context = ctx;
    }
    init() {
        this.speed = this.obj.speed || this.context.speed;
        this.color = this.obj.color || this.context.color;
        this.fontSize = this.obj.fontSize || 　this.context.fontSize;
        this.opacity = this.obj.opacity || this.context.opacity;

        // 需要创建个span元素，来计算弹幕的宽
        let span = document.createElement('span');
        span.style.position = 'absolute';
        span.style.font = `${this.fontSize}px`;
        span.innerHTML = this.value;
        document.body.appendChild(span);
        // 获取每个弹幕的宽度，然后再把span删掉
        this.width = span.clientWidth;
        document.body.removeChild(span);

        this.x = this.context.canvas.width;
        this.y = this.context.canvas.height * Math.random();

        if (this.y < this.fontSize) {
            this.y = this.fontSize
        } else if (this.y > this.context.canvas.height - this.fontSize) {
            this.y = this.context.canvas.height - this.fontSize;
        }
    }
    render() {
        this.context.ctx.font = `${this.fontSize}px "Microsoft Yahei"`;
        this.context.ctx.fillStyle = this.color;
        this.context.ctx.fillText(this.value, this.x, this.y);
    }
}

class CanvasBarrage {
    constructor(canvas, video, options = {}) {
        if (!canvas || !video) return;
        this.canvas = canvas;
        this.canvas.width = video.width;
        this.canvas.height = video.height;
        this.ctx = canvas.getContext('2d');
        this.video = video;
        // 默认参数
        let defaultOpts = {
            speed: 1.5,
            color: '#00a1f4',
            opacity: 0.4,
            fontSize: 22,
            data: []
        };
        Object.assign(this, defaultOpts, options);
        // 是否暂停，默认true为暂停
        this.isPaused = true;
        // 所有的弹幕
        this.barrages = this.data.map(obj => new Barrage(obj, this));
        // 渲染弹幕
        this.render();
    }
    render() {
        this.clear();
        this.renderBarrage();
        if (this.isPaused === false) {
            requestAnimationFrame(this.render.bind(this));
        }
    }
    renderBarrage() {
        let time = this.video.currentTime;
        this.barrages.forEach(barrage => {
            if (!barrage.flag && time >= barrage.time) {
                if (!barrage.isInit) {
                    barrage.init();
                    barrage.isInit = true;
                }
                barrage.x -= barrage.speed;
                barrage.render();
                if (barrage.x < -barrage.width) {
                    barrage.flag = true;
                }
            }
        });
    }
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    add(obj) {
        this.barrages.push(new Barrage(obj, this));
    }
    reset() {
        this.clear();
        let time = this.video.currentTime;

        this.barrages.forEach(barrage => {
            barrage.flag = false;
            if (time <= barrage.time) {
                barrage.isInit = false;
            } else {
                barrage.flag = true;
            }
        });
    }
}

ws.onopen = function () {
    ws.onmessage = function (e) {
        let msg = JSON.parse(e.data);
        console.log(msg);
        if (msg.type === 'init') {
            canvasBarrage = new CanvasBarrage(canvas, video, { data: msg.data });
        } else if (msg.type === 'add') {
            canvasBarrage.add(msg.data);
        }
    };
};
// 点击播放按钮的时候，渲染所有的弹幕
video.addEventListener('play', () => {
    canvasBarrage.isPaused = false;
    canvasBarrage.render();
});
// 点击暂停按钮可以停止渲染
video.addEventListener('pause', () => {
    canvasBarrage.isPaused = true;
});
// 当拖动进度条时，需要重新渲染在之前时间出现过的弹幕
video.addEventListener('seeked', () => {
    // 添加个reset方法
    canvasBarrage.reset();
});

// 发送弹幕的函数
function send() {
    let value = $('#text').value;
    let time = video.currentTime;
    let color = $('#color').value;
    let fontSize = $('#range').value;
    let obj = { value, time, color, fontSize };
    ws.send(JSON.stringify(obj));
    $('#text').value = '';
}
// 添加弹幕
$('#btn').addEventListener('click', send);
// 回车发送弹幕
$('#text').addEventListener('keydown', e => {
    let code = e.keyCode;
    if (code === 13) {
        send();
    }
});