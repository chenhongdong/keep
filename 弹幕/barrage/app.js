const WebSocket = require('ws');
const redis = require('redis');
const clientRedis = redis.createClient();

const ws = new WebSocket.Server({ port: 9999 });
let clients = [];
ws.on('connection', socket => {
    clients.push(socket);
    
    clientRedis.lrange('barrages', 0, -1, (err, applies) => {
        applies = applies.map(apply => JSON.parse(apply));
        socket.send(JSON.stringify({
            type: 'init',
            data: applies || []
        }));
    });
    console.log('连接成功');
    socket.on('message', data => {
        clientRedis.rpush('barrages', data, redis.print);
        // 遍历clients数组，拿到所有的socket实例
        // 每一个用户发送的消息，在所有连接ws服务端成功的用户中都可以看见
        clients.forEach(sk => {
            sk.send(JSON.stringify({
                type: 'add',
                data: JSON.parse(data)
            }));
        }); 
    });

    socket.on('close', () => {
        clients = clients.filter(client => client !== socket);
    });
});