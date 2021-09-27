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
    // TODO: check if the socket ID recieved is valid before doing anything
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

    // An array that does the initial verification for each chat to
    // check if the other person is online.
    let relationsOnline ={};

    for(let x=0;x<relations.length;x++){
        const rooms = io.of("/").adapter.rooms;

        // TODO: this doesn't work when the client has multiple instances open
        // I need to fix that, either disabling multiple instances or some other way.

        // If the room is already created, then the other user is online
        if(rooms.get(relations[x].user1 +"_"+relations[x].user2)==undefined)
            relationsOnline[x] = false
        else
            relationsOnline[x] = true

        // Join the room and notifiy everyone in the room that you did
        socket.join(relations[x].user1 +"_"+relations[x].user2)
        socket.to(relations[x].user1 +"_"+relations[x].user2).emit("roomJoined", user);
        
    }

    // Gets all friend requests and puts them into an array
    let friendRequests = (await relMann.getRequests(user)).map(value =>{
        return value.sender;
    }) ;


    // On disconnection, tell every room that you've logged off
    socket.on('disconnecting',()=>{
        for(let room of socket.rooms)
            socket.to(room).emit("roomLeft",user);
        
    })

    socket.emit('recieveFriends',relationsArray, relationsOnline, friendRequests);

    res.sendStatus(200);
}

module.exports = {setIo,joinChats}






