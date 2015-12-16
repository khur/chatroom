var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var users = [], chats = [];

app.use(express.static('public'));


app.get('/', function(request, response){
	response.sendFile(__dirname + "index.html");
});

// app.post('/', function(request, response){
// 	console.log(request.body);
// });

io.on('connection', function(socket){
	console.log('a user has connected');
	socket.on('disconnect', function(){
		console.log("user disconnected");
	});
});




http.listen(3000, function(){
	console.log("listening on port 3000...");
})