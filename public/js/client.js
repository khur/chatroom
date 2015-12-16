$('document').ready(function(){
	
});

var text = document.getElementById('chatText');

$('form').submit(function(){
	$('#chatlog').append("<li>" + text.value + "</li>")
});