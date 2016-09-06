// I am the service object (or Data Access Object or Gateway) that
// provides access to the message collection.
var EventEmitter = require('events').EventEmitter;
var util = require('util');

// Define the constructor for your derived "class"
function MessageService() {
    // call the super constructor to initialize `this`
    EventEmitter.call(this);

    // Create our collection of messages. This collection is keyed by
    // the ID of the message which is generated using the creation timestamp.
    this.messages = [];
}

// Declare that your class should use EventEmitter as its prototype.
// This is roughly equivalent to: Master.prototype = Object.create(EventEmitter.prototype)
util.inherits(MessageService, EventEmitter);

// add a messages to the collection.
MessageService.prototype.addMessage = function(value) {
    // Create the new message instance.
    var message = {
        id: Date.now(),
        value: value
    };

    // Add it to the collection.
    this.messages.push(message);

    // Broadcast the new message
    this.emit('message', message);

    // Return the new message instance.
    return message;
};

// delete the message with the given ID.
MessageService.prototype.deleteMessage = function(id) {
    // Get the message.
    var messageIndex = this.getMessageIndex(id);
    var deleted;

    // If the message exists, delete it.
    if (-1 !== messageIndex) {
        deleted = this.messages.splice(messageIndex, 1);

        // Broadcast the deleted message
        this.emit('delete', deleted);

        return deleted;
    }
};

// return the message with the given id.
MessageService.prototype.getMessage = function(id, firstAfter) {
    id = !isNaN(id) ? parseInt(id, 10) : 0;

    return this.messages.find(function(element, index, array) {
        return !firstAfter ? element.id === id : element.id >= id;
    });
};

// return the message with the given id.
MessageService.prototype.getMessageIndex = function(id, firstAfter) {
    id = !isNaN(id) ? parseInt(id, 10) : 0;

    return this.messages.findIndex(function(element, index, array) {
        return !firstAfter ? element.id === id : element.id >= id;
    });
};

// I get all the messages.
MessageService.prototype.getAll = function(startId, options) {
    options = options || {};

    var orderedMessages = [];
    var now = Date.now();
    var startIndex = 0;
    var include = options.include;
    var isStartDate = options.isStartDate;

    if (this.messages.length) {
        startId = !isNaN(startId) && startId <= now ? parseInt(startId, 10) : 0;

        if (startId) {
            startIndex = this.getMessageIndex(startId, isStartDate);
        }

        if (-1 !== startIndex && startIndex < this.messages.length) {
            if (false === include) {
                startIndex++;
            }

            if (startIndex < this.messages.length) {
                // Loop over the primary keys to build up the collection
                // of ordered messages.
                for (var i = startIndex; i < this.messages.length; i++) {
                    // Check to see if a message exists at this key.
                    if (this.messages[i]) {
                        // Add this message to the result in order.
                        orderedMessages.push(this.messages[i]);
                    }
                }
            }
        }
    }

    // Return the sorted collection.
    return orderedMessages;
};

// Return the initialized service object.
module.exports = new MessageService();
