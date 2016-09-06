if (!window.location.hash.replace('#', '')) {
    window.location.hash = Date.now();
}

var startId = window.location.hash.replace('#', '');
var split = window.location.search.split('mode=');
var mode = split[1] && split[1].split('&')[0];
var chatClient = new ChatClient({ ws: (!mode || ChatClient.MODES.WebSocket === mode), startId: startId });

function updateQueryStringParameter(uri, key, value) {
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + "=" + value + '$2');
    }
    else {
        return uri + separator + key + "=" + value;
    }
}

chatClient.subscribe(function(err, data) {
    if (!err && data && data.length) {
        data.forEach(function(message) {
            var newMessage = $('<p></p>').html(message.value);
            $('#chatbox').append(newMessage);
        });
    }
});

$(function() {
    var modeText = $('<p></p>').html('Mode: ' + chatClient.mode);
    $('#mode').append(modeText);

    $('#mode').click(function() {
        var newMode = ChatClient.MODES.Polling === chatClient.mode ? ChatClient.MODES.WebSocket : ChatClient.MODES.Polling;
        window.location.href = updateQueryStringParameter(window.location.href, 'mode', newMode);
    });

    // Handler for .ready() called.
    $('#message-form').submit(function(){
        var message = $('#chat-message').val();

        chatClient.publish({ message: message });
        this.reset();
        return false;
    });

    $('#chat-message').focus();
});
