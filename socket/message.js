const conn = require('./connection')

let io = conn.io;

function emitMessage(room, message, id){
    io.in(room).emit('recieveMsg',message, id, room)
}

module.exports = {emitMessage}