(function () {
    // 13.5 一个绑定事件处理程序并进行跟踪的函数
    var nextGuid = 1;

    this.addEvent = function (ele, type, fn) {
        // 获取相关的数据块
        var data = getData(ele);
        // 创建处理程序存储
        if (!data.handlers) data.handlers = {};
        //使用type创建该type对应的数组
        if (!data.handlers[type])
            data.handlers[type] = [];
        // 标记函数
        if (!fn.guid) fn.guid = nextGuid++;
        // 将处理程序添加到列表中
        data.handlers[type].push(fn);
        // 创建事件调度器
        if (!data.dispatcher) {
            data.disabled = false;
            data.dispatcher = function (event) {
                if (data.disabled) return;
                event = fixEvent(event);
                //调用注册的处理程序
                var handlers = data.handlers[event.type];
                if (handlers) {
                    for (var i = 0; i < handlers.length; i++) {
                        handlers[i].call(ele, event);
                    }
                }
            };
        }
        if (data.handlers[type].length == 1) {
            // 注册调度器
            if (document.addEventListener) {
                ele.addEventListener(type, data.dispatcher, false);
            }
            else if (document.attachEvent) {
                ele.attachEvent('on' + type, data.dispatcher);
            }
        }
    };

    // 13.7 事件处理程序的解绑函数
    this.removeEvent = function (ele, type, fn) {
        // 获取元素的关联数据
        var data = getData(ele);
        // 如果无事可做则直接返回
        if (!data.handlers) return;
        // 创建一个实用函数
        var removeType = function (type) {
            data.handlers[type] = [];
            tidyUp(ele, type);
        };
        // 删除所有的处理程序
        if (!type) {
            for (var t in data.handlers) removeType(t);
            return;
        }
        // 查找一个特定type的所有处理程序
        var handlers = data.handlers[type];
        if (!handlers) return;
        // 删除一个特定type的所有处理程序
        if (!fn) {
            removeType(type);
            return;
        }
        // 删除一个特定的处理程序
        if (fn.guid) {
            for (var i = 0; i < handlers.length; i++) {
                if (handlers[i].guid === fn.guid) {
                    handlers.splice(i--, 1);
                }
            }
        }
        tidyUp(ele, type);
    };



    // 13.6 清理处理程序
    function tidyUp(ele, type) {
        // 空对象判断
        function isEmpty(obj) {
            for (var i in obj) {
                return false;
            }
            return true;
        }
        var data = getData(ele);
        // 检查某一事件类型的处理程序
        if (data.handlers[type].length === 0) {
            delete data.handlers[type];

            if (document.removeEventListener) {
                ele.removeEventListener(type, data.dispatcher, false);
            }
            else if (document.detachEvent) {
                ele.detachEvent('on' + type, data.dispatcher);
            }
        }
        // 判断是否还有其他事件类型的处理程序
        if (isEmpty(data.handlers)) {
            delete data.handlers;
            delete data.dispatcher;
        }
        // 判断是否还需要data
        if (isEmpty(data)) {
            removeData(ele);
        }
    }
})();