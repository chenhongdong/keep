
function performAjaxOperation(target) {
    triggerEvent(target, 'ajax-start');

    setTimeout(function () {
        triggerEvent(target, 'ajax-complete');
    }, 5000);
}