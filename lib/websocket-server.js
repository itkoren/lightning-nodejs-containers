var WebSocketServer = require('ws').Server;
var messageService = require('./../services/message-service');

function createServer(server) {
    var wss = new WebSocketServer({ server: server });

    wss.on('connection', onconnection);

    return wss;
}

function onconnection(ws) {
    ws.on('message', function (data) {
        if (data) {
            try {
                data = JSON.parse(data);
            }
            catch(ex) {}
        }

        if (data && data.message) {
            messageService.addMessage(data.message);
        }
        else if (data && data.getAll && data.getAll.startId) {
            ws.send(JSON.stringify(messageService.getAll(data.getAll.startId, {
                include: data.getAll.include,
                isStartDate:  data.getAll.isStartDate
            })));
        }
    });

    function wsListener(data) {
        if (data) {
            if (!Array.isArray(data)) {
                data = [data];
            }

            ws.send(JSON.stringify(data));
        }
    }

    messageService.on('message', wsListener);

    ws.on('close', function () {
        messageService.removeListener('message', wsListener);
    });
}

module.exports = {
    createServer: createServer
};