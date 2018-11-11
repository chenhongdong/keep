const WebSocket = require('ws');
const redis = require('redis');
const clientRedis = redis.createClient();
const ws = new WebSocket.Server({ port: 2000 });

let clients = [];

ws.on('connection', socket => {
    clients.push(socket);

    clientRedis.lrange('barrages', 0, -1, (err, res) => {
        res = res.map(data => JSON.parse(data));
        socket.send(JSON.stringify({
            type: 'init',
            data: res
        }));
    });

    socket.on('message', data => {
        clientRedis.rpush('barrages', data, redis.print);
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