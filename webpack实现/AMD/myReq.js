// requirejs有两个方法，一个是define，另一个是require
// 所以首先我们先定义两个函数

// define 声明模块 通过require使用一个模块
// define需要三个参数，1是模块的名称，2是依赖，3是工厂函数
// ★ define作用就是把定义模块的函数保留下来
// ★ require需要哪个模块的时候就把该函数执行，然后将执行后的结果传到回调里

let factories = {}; // 定义一个关联对象，将模块名和函数进行关联
function define(name, depend, factory) {
    factories[name] = factory;
    factory.depend = depend;    // 将依赖记到factory上
}

function require(modules, callback) {
    // 循环modules将得到的结果一个一个的传给callback
    let result = modules.map(function(mod) { // song, singer
        let factory = factories[mod];    // 取到的是一个个函数 factories['song']
        let exports;
        let depend = factory.depend;     // 如果factory上有依赖，我们就取出来 ['song']
        // 取出来之后需要递归了
        // require(['song','music'], function(song,music) {})     可能会有很多依赖
        require(depend, function() {
            exports = factory.apply(null, arguments);
        });
        // exports = factory();
        console.log('依赖的是： '+exports);     // factory('song') -> 告白气球   factory('album') -> 床边故事
        
        return exports;
    });
    callback.apply(null, result);   // result为一个结果数组，所以用apply
}


// demo1 无依赖
// define('song', [], () => {
//     return '告白气球';
// });
// define('singer', [], () => {
//     return '周杰伦';
// });
// require(['singer', 'song'], (singer, song) => {
//     console.log(singer+'-'+song);   // 周杰伦-告白气球
// });

// demo2 有依赖
define('song', [], () => {
    return '告白气球';
});
define('singer', ['song', 'album'], (song, album) => {
    let singer = '周杰伦';
    return `${singer}的${song}属于专辑《${album}》`;
});
define('album', [], () => {
    return '床边故事';
});
require(['singer'], singer => {
    console.log(singer);   // 周杰伦的告白气球属于专辑床边故事
});