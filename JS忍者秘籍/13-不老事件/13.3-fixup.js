// 规范化Event对象实例
function fixEvent(event) {
    // 预定义常用的函数
    function returnTrue() { return true; }
    function returnFalse() { return false; }
    // 测试是否需要修复
    if (!event && !event.stopPropagation) {
        var old = event || window.event;
        //复制这个老项目以便可以改变这个值
        event = {};
        for (var prop in old) {
            // 克隆现有的属性
            event[prop] = old[prop];
        }
        // 事件发生在这个元素上
        if (!event.target) {
            event.target = event.srcElement || document;
        }

        event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement;

        event.preventDefault = function () {
            event.returnValue = false;
            event.isPropagationStopped = returnTrue;
        };

        event.isPropagationStopped = returnFalse;

        event.stopImmediatePropagation = function () {
            this.isImmediatePropagationStopped = returnTrue;
            this.stopPropagation();
        };

        event.isImmediatePropagationStopped = returnFalse;
        // 处理鼠标位置
        if (event.clientX != null) {
            var doc = document.documentElement, body = document.body;

            event.pageX = event.clientX +
                (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
                (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY +
                (doc && doc.scrollTop || body && body.scrollTop || 0) -
                (doc && doc.clientTop || body && body.clientTop || 0);
        }
        // 处理按键
        event.which = event.charCode || event.keyCode;
        // 鼠标点击的固定按钮
        // 0 == left;  1 == middle;  2 == right
        if (event.button != null) {
            event.button = (event.button & 1 ? 0 :
                    (event.button & 4 ? 1 :
                            (event.button & 2 ? 2 : 0)
                    )
            );
        }
    }
    return event;
}