var socket = io();

var user = prompt('What is your name?');



$('form').submit(function(){

    socket.emit('chat message', user + ": " + $('#inputText').val());
    $('#inputText').val('');
    return false;

 });

socket.on('chat message', function(msg){
    $('#chatlog').append($('<li>').text(msg));
});