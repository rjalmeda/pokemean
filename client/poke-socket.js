$(document).ready(function(){
    var socket = io.connect();
    socket.emit('initialize', {connected: true});
    socket.on('serverresponse', function(data){
    });
});