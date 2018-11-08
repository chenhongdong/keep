### 模块化
模块化是指把一个复杂的系统分解到多个模块以方便编写。

#### 命名空间
开发网页要通过命名空间的方式来组织代码
```
<script src="jquery.js">
```
- 命名空间冲突，两个库可能会使用同一个名称
- 无法合理的管理项目的依赖和版本
- 无法方便的控制依赖的加载顺序
#### CommonJS
CommonJS是一种使用广泛的JavaScript模范化管理，核心思想是通过require方法来同步地加载依赖的其他模块，通过module.exports导出需要暴露的接口

##### 用法
采用CommonJS导入及导出时的代码如下：
```
// 导入
const A = require('./a.js');
fn();

// 导出
module.exports = A.fn;
```
##### 原理实现
```
a.js

module.exports = '刚好遇见你';
b.js

const fs = require('fs');
// CommonJS简单实现
function req(pathName) {
    // content代表的是文件内容
    let content = fs.readFileSync(pathName, 'utf8');
    // 最后一个参数是函数的内容体
    let fn = new Function('exports', 'require', 'module', '__filename', '__dirname', content+'\n return module.exports');
    let module = {
        exports: {}
    };
    // 函数执行就可以取到module.exports的值了
    return fn(module.exports, req, module, __filename, __dirname);
}
const str = req('./a.js');
console.log(str);   // '刚好遇见你'
```
#### AMD
AMD也是一种JavaScript模块化规范，与CommonJS最大的不同在于它采用异步的方式去加载依赖的模块。 AMD规范主要是为了解决针对浏览器环境的模块化问题，最具代表性的实现是RequireJS

AMD的优点
- 可在不转换代码的情况下直接在浏览器里运行
- 可加载多个依赖
- 代码可运行在浏览器环境和Node环境中
AMD的缺点
- Js运行环境没有原生支持AMD，需要先导入实现了AMD的库才能正常使用

##### 用法
```
// 定义模块
define('a', [], () => {
    return 'hello';
});
define('b', ['a'], a => { // 依赖a模块
    return a + ' world';
});

// 导入和使用
require(['b'], b => {
    console.log(b);     // 'hello world'
});
```
##### 原理实现
```
let factories = {};     // 管理一个关联对象，将模块名和函数关联起来
// 定义模块define  三个参数：1.模块名 2.依赖 3.工厂函数
function define(name, depend, factory) {
    factories[name] = factory;
    factory.depend = depend;
}

function require(modules, callback) {
    let result = modules.map(mod => {   // 返回一个结果数组
        let factory = factories[mod];   // 拿到模块对应的函数
        let exports;
        let depend = factory.depend;    // 取到函数上的依赖 ['a']
        require(depend, () => {         // 递归require
            exports = factory.apply(null, arguments);
        });
        return exports;     // exports得到的是返回的值， 'hello' , ' world'
    });
    callback.apply(null, result);
}
```
### ES6 模块化
- ES6模块化是ECMA提出的JS模块化规范，它在语言的层面上实现了模块化。
- 最主要的是它将取代CommonJS和AMD规范，成为浏览器和服务器通用的模块解决方案
```
// 导入
//import {each, ...} from 'underscore.js';	// es6 按需引入
//var _ = require('underscore.js');			// amd 全局引入

// 导出
//export {each, map, ...};	// es6 多点暴露
//module.exports = _;		// amd 全局暴露
```