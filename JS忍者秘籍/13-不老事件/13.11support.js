function isEventSupported(eventName) {
    // 创建一个div元素用于测试,稍后会删除它
    var ele = document.createElement('div'),
        isSupported;
    // 通过检测元素是否有一个属性表示该事件,来判断是否支持该事件
    eventName = 'on' + eventName;
    isSupported = (eventName in ele);
    // 如果上述检测失败,创建一个同名特性并检查其是否可以支持该事件
    if (!isSupported) {
        ele.setAttribute(eventName, 'return;');
        isSupported = typeof ele[eventName] == 'function';
    }
    // 不管结果如何,都要删除临时元素
    ele = null;
    return isSupported;
}