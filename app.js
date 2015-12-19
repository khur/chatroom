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

// Middleware 

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

// Socket.io

io.on('connection', function(client) {

  client.on('join', function(user) {

    client.nickname = user;
    // 
    client.broadcast.emit("add chatter", user);

    redisClient.smembers("chatters", function(err, names){
      names.forEach(function(name){
        client.emit("add chatter", name);
      });
    });

    redisClient.sadd("chatters", client.nickname);

    redisClient.lrange("messages", 0, -1, function(err, messages) {
      messages.reverse();
      // console.log("messages: ", messages);
      messages.forEach(function(message) {
        message = JSON.parse(message);
        client.emit('chat message', message.name + ": " + message.data);
      });
    });

    console.log(user + ' joined the chat.');

  });


  client.on('chat message', function(msg) {
    var nickname = client.nickname;

    storeMessage(nickname, msg)

    console.log(nickname + ": " + msg);
    client.broadcast.emit('chat message', nickname + ': ' + msg);
    client.emit('chat message', nickname + ': ' + msg);
  });



  client.on('disconnect', function(name) {
    
    client.broadcast.emit("remove chatter", client.nickname);

    redisClient.srem('chatters', client.nickname);

    console.log( client.nickname, " disconnected");
    

  });

});

http.listen(3000, function() {
  console.log("listening on port 3000...");
})
