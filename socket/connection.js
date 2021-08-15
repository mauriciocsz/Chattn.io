let io;

function setIo(app){
    io = require('socket.io')(app);
    connect()
}

function connect(){
    io.on('connection', socket => {
    
        module.exports = {io}
        //TODO: Join every room the user has a chat with
        //Placeholder room for testing
        socket.join('testroom')

        socket.on('join', room =>  socket.join(room))
    
    })
}

module.exports = {setIo}






