const fs = require('fs');

function req(name) {
    let content = fs.readFileSync(name, 'utf8');    // 获取读到的内容 ->  module.exports = 'PLANET';
    let fn = new Function('exports', 'require', 'module', '__filename', '__dirname', content+'\n return module.exports');
    let module = {
        exports: {}
    };
    return fn(module.exports, req, module, __filename, __dirname);
}

let s = req('./a.js');
console.log(s);

