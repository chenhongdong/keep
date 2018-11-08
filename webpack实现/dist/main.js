
(function (modules) {
    function require(moduleId) {
        var module = {
            exports: {}
        };
        modules[moduleId].call(module.exports, module, module.exports, require);
        return module.exports;
    }
    return require("./src/index.js");
})
    ({
        "./src/index.js":
            (function (module, exports, require) {
                eval(`let str = require('src\a.js');
require('src\index.css');
console.log(str);

// webpack4会默认找src下的index.js`);
            })
            ,
                "src\a.js":
                (function (module, exports, require) {
                    eval(`module.exports = '天青色等烟雨 而我在等你';`);
                })
            ,
                "src\index.css":
                (function (module, exports, require) {
                    eval(`
        let style = document.createElement('style');
        style.innerHTML = "*{margin: 0;padding:0;}body{     background: #00a1f5;}";
        document.head.appendChild(style);  
    `);
                })
            
    });
