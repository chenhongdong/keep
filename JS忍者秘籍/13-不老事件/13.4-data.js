//13.4 实现一个中央对象用于保存DOM元素信息

(function () {
    // 创建作用域存储对象
    var cache = {},
        guidCounter = 1,
        expando = 'data' + (new Date).getTime();
    // 定义getData函数
    this.getData = function (ele) {
        var guid = ele[expando];
        if (!guid) {
            guid = ele[expando] = guidCounter++;
            cache[guid] = {};
        }
        return cache[guid];
    };
    // 定义removeData函数
    this.removeData = function (ele) {
        var guid = ele[expando];
        if (!guid) return;
        delete cache[guid];

        try {
            delete ele[expando];
        }
        catch (e) {
            if (ele.removeAttribute) {
                ele.removeAttribute(expando);
            }
        }
    };
})();