var express = require('express');
var app = express();


var users = [], chats = [];

app.use(express.static('public'));


app.get('/', function(request, response){
	response.sendFile(__dirname + "index.html");
});

app.post('/', function(request, response){
	console.log(request.body);
});




app.listen(3000, function(){
	console.log("listening on port 3000...");
})