let io;

function setIo(app){
    io = require('socket.io')(app);
    connect()
}

function connect(){
    io.on('connection', socket => {

        // Makes the user identify themselves so we
        // can make him join all his chat rooms
        socket.emit('identification');
    
        module.exports = {io}

        socket.on('join', room =>  socket.join(room))
    
    })
}
// Function to make a logged user join all his chats. 
// TODO: put the requisition part of this
// function in a 'controller
async function joinChats(req, res){
    const relMann = require('./../db/relationship_manager')

    let socket_id = req.body.id;
    let user = req.session.username;

    //Gets the user's socket
    let socket = (io.sockets['sockets']).get(socket_id);

    // Make the user join a private room with his name 
    // so we can find him more easily in the future.
    socket.join(user)

    //Connect to every 'friend' he has
    let relations = await relMann.getRelations(user);
    let relationsArray = relations.map( (value,index,array) => {
        if(value.user1==user)
            return value.user2;
            return value.user1;
    })
    for(let x=0;x<relations.length;x++){
        socket.join(relations[x].user1 +"_"+relations[x].user2)
    }

    socket.emit('recieveFriends',relationsArray);

    res.sendStatus(200);
}

module.exports = {setIo,joinChats}






