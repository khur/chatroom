var server = io.connect('http://localhost:3000');



server.on('connect', function(data) {
    user = prompt('What is your name?');
    server.emit('join', user);
});


$('form').submit(function() {
	message = $('#inputText').val();
    server.emit('chat message', message );
    $('#inputText').val('');
    return false;
});

server.on('chat message', function(msg) {
    $('#chatlog').append($('<li>').text(msg));
});

server.on("add chatter", function(name){
	chatter = $('<li>' + name + '</li>').data('name', name);
	$('#userList').append(chatter);
});

server.on('remove chatter', function(name){
	$("#userList li[data-name=" + name + "]").remove();
});
