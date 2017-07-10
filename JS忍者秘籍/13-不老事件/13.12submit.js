(function () {
    var isSubmitEventSupported = isEventSupported('submit');
    // 定义一个实用函数,用于判断传入的元素是否在一个表单内
    function isInForm(ele) {
        var parent = ele.parentNode;
        while (parent) {
            if (parent.nodeName.toLowerCase() === 'form') {
                return true;
            }
            parent = parent.parentNode;
        }
        return false;
    }
    // 预定义一个click处理程序,判断submit事件是否应该借道于该事件,如果应该就触发submit事件
    function triggerSubmitOnClick(e) {
        var type = e.target.type;
        if ((type === 'submit' || type === 'image') && isInForm(e.target)) {
            return triggerEvent(this, 'submit');
        }
    }
    // 预定义一个keypress处理程序,判断submit事件是否应该借道于该事件,如果应该就触发submit事件
    function triggerSubmitOnKey(e) {
        var type = e.target.type;
        if ((type === 'text' || type === 'password') && isInForm(e.target) && e.keyCode === 13) {
            return triggerEvent(this, 'submit');
        }
    }

    // 创建一个绑定submit事件的特殊函数
    this.addSubmit = function (ele, fn) {
        // 正常绑定submit处理程序,如果浏览器支持submit冒泡就直接返回
        addEvent(ele, 'submit', fn);
        if (isSubmitEventSupported) return;

        // 如果不是form元素,并且该submit处理程序是第一个处理程序,那么就创建click和keypress借道处理程序
        if (ele.nodeName.toLowerCase() !== 'form' && getData(ele).handlers.submit.length === 1) {
            addEvent(ele, 'click', triggerSubmitOnClick);
            addEvent(ele, 'keypress', triggerSubmitOnKey);
        }
    };

    // 创建一个解绑submit事件的特殊函数
    this.removeSubmit = function (ele, fn) {
        // 正常解绑处理程序,如果浏览器支持submit冒泡就直接返回
        removeEvent(ele, 'submit', fn);
        if (isEventSupported('submit')) return;

        var data = getData(ele);
        //
        if (ele.nodeName.toLowerCase() !== 'form' && !data || !data.events || !data.events.submit) {
            removeEvent(ele, 'click', triggerSubmitOnClick);
            removeEvent(ele, 'keypress', triggerSubmitOnKey);
        }
    };
})();