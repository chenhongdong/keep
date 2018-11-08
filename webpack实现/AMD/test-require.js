
// 定义模块
define('a', [], function() {
    return 'hi';
});
define('b', ['a'], function(a) {
    return a + ' world';
});

require(['b'], function(b) {
    console.log(b);     // hi world
});