if (!window.location.hash.replace('#', '')) {
    window.location.hash = Date.now();
}

var startId = window.location.hash.replace('#', '');
var split = window.location.search.split('mode=');
var mode = split[1] && split[1].split('&')[0];
var chatClient = new ChatClient({ ws: (!mode || ChatClient.MODES.WebSocket === mode), startId: startId });

/**
 * Breaks down URLs with a regex and returns the parts
 * @param url
 * @returns {{href: *, host: (*|string), hostname: (*|string), port: (*|string), pathname: string, protocol: *, hash: (*|string), search: (*|string), origin: string}}
 */
function getUrlParts(url) {

    var urlParseRegEx = new RegExp(/((?:http|ftp|ws){0,1}s{0,1}\:){0,1}(?:\/\/){0,1}([\d{}a-z\.-]*)?\:{0,1}(\d+){0,1}([^#?]+){0,1}([$\?][\S+][^#]+){0,1}([#\S+]+){0,1}/ig),
        urlPartMatches;
    /*
     Parts mapping:
     0 - Complete url
     1 - protocol
     2 - host
     3 - port
     4 - pathname
     5 - query string
     6 - hash
     */

    if (typeof url === 'string') {
        urlPartMatches = urlParseRegEx.exec(url);
    } else {
        urlPartMatches = [];
    }

    return {
        href: url,
        protocol: urlPartMatches[1] || '',
        host: (urlPartMatches[2] || '') + (urlPartMatches[3] ? ':' + urlPartMatches[3] : ''),
        hostname: urlPartMatches[2] || '',
        port: urlPartMatches[3] || '',
        pathname: urlPartMatches[4] || '',
        search: urlPartMatches[5] || '',
        hash: urlPartMatches[6] || '',
        origin: (urlPartMatches[1] ? urlPartMatches[1] + '//' : '') + (urlPartMatches[2] || '') + (urlPartMatches[3] ? ':' + urlPartMatches[3] : '')
    };
}

/**
 * Construct URLs from parts
 * @param urlParts
 * @returns url string
 */
function constructUrlFromParts(urlParts) {
    return (urlParts.protocol ? urlParts.protocol + '//' : '') + urlParts.host + urlParts.pathname + (urlParts.search ? urlParts.search : '') + (urlParts.hash ? urlParts.hash : '');
}

/**
 * Add or Updates a querystring parameter
 * @param uri
 * @param key
 * @param value
 * @returns updated url
 */
function updateQueryStringParameter(uri, key, value) {
    var re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
    var separator;
    var parts;

    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + '=' + value + '$2');
    }
    else {
        separator = uri.indexOf('?') !== -1 ? '&' : '?';
        parts = getUrlParts(uri);
        parts.search += separator + key + '=' + value;

        return constructUrlFromParts(parts);
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
