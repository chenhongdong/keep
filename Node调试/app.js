let express = require('express');
let app = express();
let path = require('path');

// 设置静态文件夹
app.use(express.static(path.resolve('src')));

// 设置模板
app.set('view engine', 'html');
app.set('views', path.resolve('views'));
app.engine('html', require('ejs').__express);

app.get('/', function (req, res) {
    res.render('index', {
        title: '这是主页',
        main: '<a href="/login">登录</a>'
    });
});

app.get('/login', function (req, res) {
    
});

app.listen(9999);

