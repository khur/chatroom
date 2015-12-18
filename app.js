var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyparser = require('body-parser');
//DATABASE
var redis = require('redis');
var redisClient = redis.createClient();



redisClient.on("error", function(err) {
    console.log("Error " + err);
});


app.use(bodyparser.json());
app.use(express.static('public'));
app.get('/', function(request, response) {
    response.sendFile(__dirname + "index.html");
});

var storeMessage = function(name, data) {
	var message = JSON.stringify({
	    name: name,
	    data: data
	});

	redisClient.lpush("messages", message,
	    function(err, response) {
	        redisClient.ltrim("messages", 0, 14);
	    });
};



io.on('connection', function(client) {

    client.on('join', function(user) {

    	client.nickname = user;

    	redisClient.sadd("chatters", client.nickname, function(reply){
    		console.log(reply);
    	});

        redisClient.lrange("messages", 0, -1, function(err, messages) {
            messages.reverse();
            console.log(messages);
            messages.forEach(function(message) {
                message = JSON.parse(message);

                client.emit('chat message', message.name + ": " + message.data);
            })
        });

        
        console.log(user + ' joined the chat.');
    });


    client.on('chat message', function(msg) {
    	
        console.log(msg);
        io.emit('chat message', msg);
    });



    client.on('disconnect', function() {
        console.log(client.nickname + " disconnected");
        // redisClient.srem("chatters", client.nickname);
    });

});




http.listen(3000, function() {
    console.log("listening on port 3000...");
})
