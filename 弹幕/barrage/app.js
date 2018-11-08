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
            data: applies
        }));
    });

    socket.on('message', data => {
        clientRedis.rpush('barrages', data, redis.print);
        socket.send(JSON.stringify({
            type: 'add',
            data: JSON.parse(data)
        }));
    });

    ws.on('close', () => {
        clients = clients.filter(client => client !== socket);
    });
});