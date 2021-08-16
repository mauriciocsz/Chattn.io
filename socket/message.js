const conn = require('./connection')

let io = conn.io;

function emitMessage(room, message, id, encpRoom){
    io.in(room).emit('recieveMsg',message, id, encpRoom)
}

module.exports = {emitMessage}