// Include the necessary modules.
var http = require('http');
var messageService = require('./services/message-service');

// ---------------------------------------------------------- //
// ---------------------------------------------------------- //

// Create an instance of the HTTP server.
var server = http.createServer(
    function (request, response) {

        // We are going to be looking at urls for RESTful commands.
        // Set our default response.
        var apiResponse;
        var match;

        // Define our patterns.
        var patterns = {
            getAll: new RegExp('messages/get', 'i'),
            getMessage: new RegExp('messages/(\\d+)/get', 'i'),
            deleteMessage: new RegExp('messages/(\\d+)/delete', 'i'),
            addMessage: new RegExp('messages/add/([^/]+)', 'i')
        };

        // Strip off the leading and trailing slashes.
        var restUri = request.url.replace(new RegExp('^/|/$', 'g'), '');

        // Loop over the patterns to see if any match.
        for (var patternKey in patterns) {
            // Try to match the pattern against the URL.
            if (match = restUri.match(patterns[patternKey])) {
                // Pass the request off to the service layer.
                apiResponse = messageService[patternKey](match[1]);

                // The RESTful URL can only match one pattern.
                // Since we found a match, break out of the loop.
                break;
            }

        }

        // For our demo purposes, our API will always return a valid
        // response if the API request was successful. Otherwise,
        // something could not be found.
        if (apiResponse) {
            // Set the 200-OK header.
            response.writeHead(200, { 'Content-Type': 'application/json' });

            // Return the response from the API request.
            response.write(JSON.stringify(apiResponse));
        }
        else {
            // Something went wrong.
            response.writeHead(404, { 'Content-Type': 'text/plain' });
            response.write('404 - Go Back!!!! There is Nothing to See Here!!! Nothing to See Here!!!');
        }

        // Close the response.
        response.end();
    }
);

// Point the server to listen to the given port for incoming
// requests.
server.listen(process.env.PORT || 3000, process.env.HOST || '0.0.0.0', function() {
    console.log('HTTP Server Started. Listening on ' + server.address().family + '/' + server.address().address + ' : Port ' + server.address().port);
});
