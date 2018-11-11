const WebSocket = require('ws');
const redis = require('redis');
const clientRedis = redis.createClient();
const ws = new WebSocket.Server({ port: 9999 });

let clients = [];

ws.on('connection', socket => {
    clients.push(socket);

    clientRedis.lrange('barrages', 0, -1, (err, data) => {
        data = data.map(item => JSON.parse(item));
        socket.send(JSON.stringify({
            type: 'init',
            data
        }));
    });

    socket.on('message', data => {
        clientRedis.rpush('barrages', data);
        
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