let $ = document.querySelector.bind(document);
let canvas = $('#canvas');
let video = $('#video');
// 每一个弹幕的类
class Barrage {
    constructor(obj, context) {
        this.value = obj.value;
        this.time = obj.time;
        this.obj = obj;
        this.context = context;
    }
    init() {
        this.opacity = this.obj.opacity || this.context.opacity;
        this.color = this.obj.color || this.context.color;
        this.speed = this.obj.speed || this.context.speed;
        this.fontSize = this.obj.fontSize || this.context.fontSize;

        let span = document.createElement('span');
        span.style.position = 'absolute';
        span.style.fontSize = this.fontSize + 'px';
        span.innerText = this.value;
        document.body.appendChild(span);
        // 给每个弹幕设宽高
        this.width = span.clientWidth;
        document.body.removeChild(span);

        this.x = this.context.canvas.width;
        this.y = this.context.canvas.height * Math.random();

        if (this.y <= this.fontSize) {
            this.y = this.fontSize;
        } else if (this.y > this.context.canvas.height - this.fontSize) {
            this.y = this.context.canvas.height - this.fontSize;
        }
    }
    render() {
        this.context.ctx.font = this.fontSize + 'px "Microsoft Yahei"';
        this.context.ctx.fillStyle = this.color;
        this.context.ctx.fillText(this.value, this.x, this.y);
    }
}
// CanvasBarrage类
class CanvasBarrage {
    constructor(canvas, video, options = {}) {
        if (!canvas || !video) return;
        // 设置一些canvas的内容，如宽高和画布
        this.canvas = canvas;
        this.canvas.width = video.width;
        this.canvas.height = video.height;
        this.ctx = canvas.getContext('2d');
        this.video = video;
        // 默认参数
        let defaultOptions = {
            color: '#f25d8e',
            speed: 1.5,
            fontSize: 22,
            opacity: 0.3,
            data: []
        };
        // 合并对象，把参数全挂到this实例上
        Object.assign(this, defaultOptions, options);

        this.isPaused = true;   // 默认暂停
        // 所有的弹幕
        this.barrages = this.data.map(obj => new Barrage(obj, this));
        //  渲染弹幕
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
    add(obj) {
        this.barrages.push(new Barrage(obj, this));
    }
    reset() {
        console.log('reset');
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
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

let canvasBarrage;
let ws = new WebSocket('ws://localhost:9999');

ws.onopen = function () {
    ws.onmessage = function (e) {
        let msg = JSON.parse(e.data);
        if (msg.type === 'init') {
            canvasBarrage = new CanvasBarrage(canvas, video, { data: msg.data });
            console.log(canvasBarrage);
        } else if (msg.type === 'add') {
            canvasBarrage.add(msg.data);
        }
    };
};

video.addEventListener('play', () => {
    canvas.style.display = 'block';
    
    canvasBarrage.isPaused = false;
    canvasBarrage.render();
});

video.addEventListener('pause', () => {
    canvasBarrage.isPaused = true;
});

video.addEventListener('seeked', () => {
    canvasBarrage.reset();
});

video.addEventListener('ended', () => {
    console.log('end');
    canvasBarrage.isPaused = true;
    canvasBarrage.clear();
    canvas.style.display = 'none';
});

function send() {
    let time = video.currentTime;
    let value = $('#text').value;
    let color = $('#color').value;
    let fontSize = $('#range').value;
    let obj = { time, value, color, fontSize };

    ws.send(JSON.stringify(obj));
    $('#text').value = '';
}

// 添加弹幕
$('#btn').addEventListener('click', () => {
    send();
});


$('#text').addEventListener('keydown', e => {
    let code = e.keyCode;
    if (code === 13) {
        send();
    }
});