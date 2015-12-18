var server = io.connect('http://localhost:3000');



server.on('connect', function(data) {
    user = prompt('What is your name?');
    server.emit('join', user);
});


$('form').submit(function() {
	message = {
		user: user,
		text: $('#inputText').val()
	}
    server.emit('chat message', message.user + ": " + message.text);
    $('#inputText').val('');
    return false;
});

server.on('chat message', function(msg) {
    $('#chatlog').append($('<li>').text(msg));
});
