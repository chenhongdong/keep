// 13.15 实现跨浏览器的DOM ready事件

(function () {
    // 刚开始,假设还没就绪
    var isReady = false,
        contentLoadedHandler;
    // 定义一个函数只触发一次ready处理程序,后续调用不再处理任何事情
    function ready() {
        if (!isReady) {
            triggerEvent(document, 'ready');
            isReady = true;
        }
    }
    // 如果此时DOM已经就绪了,直接触发该ready处理程序
    if (document.readyState === 'complete') {
        ready();
    }
    // 对于W3C浏览器,创建一个DOMContentLoaded事件处理程序,触发ready处理程序,然后再删除自身
    if (document.addEventListener) {
        contentLoadedHandler = function () {
            document.removeEventListener('DOMContentLoaded', contentLoadedHandler, false);
            ready();
        };
        // 将刚才创建的contentLoadedHandler处理程序绑定在DOMContentLoaded事件上
        document.addEventListener('DOMContentLoaded', contentLoadedHandler, false);
    }
    // 对于IE,创建一个处理程序,在文档readyState为complete状态时,删除自身并触发ready处理程序
    else if (document.attachEvent) {
        contentLoadedHandler = function () {
            if (document.readyState === 'complete') {
                document.detachEvent('onreadystatechange', contentLoadedHandler);
                ready();
            }
        };
        // 将上述刚创建的处理程序绑定在onreadystatechange事件上,稍后会触发,但需确保该事件不在iframe里
        document.attachEvent('onreadystatechange', contentLoadedHandler);

        var toplevel = false;
        try {
            toplevel = window.frameElement == null;
        } catch (e) {}
        // 如果不在iframe里,就执行滚动检测
        if (document.documentElement.doScroll && toplevel) {
            doScrollCheck();
        }
    }
    // 定义滚动检测函数,持续进行滚动,一直到滚动成功
    function doScrollCheck() {
        if (isReady) return;
        try {
            document.documentElement.doScroll('left');
        } catch (error) {
            setTimeout(doScrollCheck, 1);
            return;
        }
        ready();
    }
})();