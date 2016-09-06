if (!window.location.hash.replace('#', '')) {
    window.location.hash = Date.now();
}

var startId = window.location.hash.replace('#', '');
var chatClient = new ChatClient({ startId: startId });

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

    // Handler for .ready() called.
    $('#message-form').submit(function(){
        var message = $('#chat-message').val();

        chatClient.publish({ message: message });
        this.reset();
        return false;
    });

    $('#chat-message').focus();
});
