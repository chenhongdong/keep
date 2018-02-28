// 13.1 绑定事件处理程序时,设置正确的上下文

// 检测是否支持DOM Model
if (document.addEventListener) {
    // 使用DOM Model创建绑定函数
    this.addEvent = function (ele, type, fn) {
        ele.addEventListener(type, fn , false);
        return fn;
    };
    // 使用DOM Model创建解绑函数
    this.removeEvent = function (ele, type, fn) {
        ele.removeEventListener(type, fn, false);
    };
} else if (document.attachEvent) {
    this.addEvent = function (ele, type, fn) {
        var bound = function () {
            return fn.apply(ele, arguments);
        };
        ele.attachEvent('on' + type, bound);
        return bound;
    }

    this.removeEvent = function (ele, type, fn) {
        ele.detachEvent('on' + type, fn);
    }
}