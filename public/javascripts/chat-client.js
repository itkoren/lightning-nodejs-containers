function ChatClient(options) {
    options = options || {};

    var transport;
    var mode;

    if (window.WebSocket && false !== options.ws) {
        mode = ChatClient.MODES.WebSocket;
    }
    else {
        mode = ChatClient.MODES.Polling;
    }

    transport = ChatClient[mode];

    if ('function' === typeof transport.setup) {
        transport.setup.call(this);
    }

    this.subscribe = transport.subscribe;
    this.publish = transport.publish;
    this.startId = options.startId;
    this.mode = mode;
}

function getStartId(data) {
    return data && data[data.length - 1] && data[data.length - 1].id;
}

function buildQueryString(options) {
    options = options || {};

    var include = options.include;
    var isStartDate = options.isStartDate;
    var query = '?ts=' + Date.now();

    if (include) {
        query += '&include=true';
    }
    else {
        query += '&include=false';
    }

    if (isStartDate) {
        query += '&isStartDate=true';
    }
    else {
        query += '&isStartDate=false';
    }

    return query;
}

function polling(options, callback) {
    options = options || {};

    var xhr = new XMLHttpRequest();
    var startId = 'object' === typeof options ? options.startId : options;

    // The last parameter must be set to true to make an asynchronous request
    xhr.open('GET', '/messages' + (startId ? '/' + startId : '') + buildQueryString(options), true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json');

    //xhr.timeout = 30000; // time in milliseconds
    xhr.onload = function() {
        var data = xhr.response;
        var startIdNew;

        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                data = JSON.parse(xhr.response);
                if (data && data.length) {
                    startIdNew = getStartId(data);
                }
            }
            catch(ex) {}

            callback(null, data);
        }
        else {
            callback(new Error('Error !'));
        }

        setTimeout(function() {
            polling(startIdNew || options, callback);
        }, 0);
    };

    xhr.ontimeout = function (err) {
        // XMLHttpRequest timed out. Do something here.
        setTimeout(function() {
            polling(options, callback);
        }, 0);
    };

    xhr.send();
}

ChatClient.MODES = {
    WebSocket: 'WebSocket',
    Polling: 'Polling'
};

ChatClient.Polling = {
    subscribe: function (callback) {
        polling({
            startId: this.startId,
            include: true,
            isStartDate: true
        }, callback);
    },
    publish: function (data) {
        var xhr = new XMLHttpRequest();
        var params = '';

        for (var attr in data) {
            if (data.hasOwnProperty(attr)) {
                params += (params.length ? '&' : '') + attr + '=' + encodeURIComponent(data[attr]);
            }
        }

        // The last parameter must be set to true to make an asynchronous request
        xhr.open('POST', '/messages', true);

        //Send the proper header information along with the request
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                console.log(xhr.response);
            }
            else {
                console.log('Error !');
            }
        };
        xhr.send(params);
    }
};

ChatClient.WebSocket = {
    setup: function () {
        this.socket = new WebSocket('ws://localhost:3000');

        this.socket.onopen = function (event) {
            this.socket.send(JSON.stringify({
                getAll: {
                    startId: this.startId,
                    include: true,
                    isStartDate: true
                }
            }));
        }.bind(this);
    },
    subscribe: function (callback) {
        this.socket.onmessage = function (event) {
            callback(null, JSON.parse(event.data));
        };
    },
    publish: function (data) {
        this.socket.send(JSON.stringify(data));
    }
};
