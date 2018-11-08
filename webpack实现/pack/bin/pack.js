#! /usr/bin/env node
// 这个文件就要描述如何打包
let entry = './src/index.js';   // 入口文件
let output = './dist/main.js';  //出口文件
let fs = require('fs');
let path = require('path');
let script = fs.readFileSync(entry, 'utf8');

let modules = [];
let styleLoader = function(source) {    // 负责将结果进行更改 更改后继续走
    // source代表的就是样式文件中的内容
    // 处理逻辑
    return `
        let style = document.createElement('style');
        style.innerHTML = ${JSON.stringify(source).replace(/(\\r)?\\n/g, '')};
        document.head.appendChild(style);  
    `;
    /*
        JSON.stringify处理字符串不能换行
        如： body {
            background: #0cc;
        }
        replace这里处理stringify后的\r\n换行符
    */ 
};


// require('./a.js');
// 处理依赖关系
script = script.replace(/require\(['"](.+?)['"]\)/g, function() {
    let name = path.join('./src/', arguments[1]);    // ./a.js
    let content = fs.readFileSync(name, 'utf8');
    if (/\.css$/.test(name)) {
        content = styleLoader(content);
    }
    modules.push({
        name,
        content
    });
    return `require('${name}')`;
});

let ejs = require('ejs');
// let name = 'nba';
// console.log(ejs.render('<a><%=name%></a>', {name})); // =转义 -不转义


let template = `
(function (modules) {
    function require(moduleId) {
        var module = {
            exports: {}
        };
        modules[moduleId].call(module.exports, module, module.exports, require);
        return module.exports;
    }
    return require("<%-entry%>");
})
    ({
        "<%-entry%>":
            (function (module, exports, require) {
                eval(\`<%-script%>\`);
            })
            <%for(var i = 0; i < modules.length;i++){
                let mod = modules[i];%>,
                "<%-mod.name%>":
                (function (module, exports, require) {
                    eval(\`<%-mod.content%>\`);
                })
            <%}%>
    });
`;
// result为替换后的结果，最终要写到output中
let result = ejs.render(template, {
    entry,
    script,
    modules
});
fs.writeFileSync(output, result);
console.log('编译成功');

// 目前单个文件打包编译可以了，主要就是替换的功能