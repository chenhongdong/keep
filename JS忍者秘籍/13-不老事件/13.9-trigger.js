// 13.9在元素上触发一个冒泡事件
function triggerEvent(ele, event) {
    // 获取元素数据以及元素的父元素
    var eleData = getData(ele),
        parent = ele.parentNode || ele.ownerDocument;
    // 如果传入的event名称是一个字符串,就为此创建一个event对象
    if (typeof event === 'string') {
        event = { type: event, target: ele};
    }
    // 对event属性进行规范化
    event = fixEvent(event);
    // 如果传入的元素有事件调度器,就执行该类型的处理程序
    if (eleData.dispatcher) {
        eleData.dispatcher.call(ele, event);
    }
    // 除非显式停止冒泡,一直递归调用该函数,将事件向上冒泡到DOM上
    if (parent && !event.isPropagationStopped) {
        triggerEvent(parent, event);
    }
    // 如果DOM到顶了,就触发默认行为
    else if (!parent && !event.isDefaultPrevented) {
        var targetData = getData(event.target);
        // 判断模板元素有木有该事件的默认行为
        if (event.target[event.type]) {
            // 在模板元素上临时禁用事件调度器,因为已经支持了处理程序
            targetData.disabled = true;
            // 执行默认行为
            event.target[event.type]();

            targetData.disabled = false;
        }
    }

}