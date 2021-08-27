const redisDb = require('./../redis/storage')
const crypto = require('crypto')
const keyCryp = require('./../encryption/keys')
const roomCryp = require('./../encryption/rooms')

async function send (req, res){

    const messageSocket = require('../socket/message')

    let {msg, reciever, id} = req.body;
    let {private_key, username} = req.session;

    //  Check if you recieved all the data correctly before doing anything

    try{
        let PublicKey = await redisDb.getPublicKey(reciever);
        
        //  Get the rooms (normal & encrypted)
        let order = [reciever,username].sort() 
        let roomEncryptd = roomCryp.encryptRoom(order[0],order[1]);
        let roomName= (order[0]+"_"+order[1])

        let key = await keyCryp.getSecret(PublicKey,private_key)

        //  Generate an IV
        const iv = crypto.randomBytes(16);
        let iv64 = iv.toString('base64')

        // Generate an cipher and encrypt the message
        const encrypter = crypto.createCipheriv('aes-256-cbc',Buffer.from(key, 'hex'),iv);
        let result = encrypter.update(msg,'utf8', 'hex')
        result+= encrypter.final('hex')
        result+=" "+iv64

        messageSocket.emitMessage(roomName,result, id, roomEncryptd);

        res.sendStatus(200);
        
    }catch(error){
        res.sendStatus(500);
        console.log(error)
    }

}

async function decrypt(req, res){
    let {encMessage, room} = req.body;
    let {username, private_key} = req.session;

    // Get the users in the chat
    let usernames = roomCryp.decryptRoom(room)

    //  Find out who's the other user
    let otherUser;
    if(username==usernames[0])
        otherUser = usernames[1]; 
    else if(username==usernames[1])
        otherUser = usernames[0]; 
    else{
        res.status(401).json('Erro!')
        return;
    }

    let PublicKey = await redisDb.getPublicKey(otherUser);
    let key = await keyCryp.getSecret(PublicKey,private_key)

    
    // Split the Encrypted message and the IV
    let encriptedMsg = encMessage.split(' ')

    //Decrypt the message
    const decrypter = crypto.createDecipheriv('aes-256-cbc',Buffer.from(key, 'hex'),Buffer.from(encriptedMsg[1],'base64'));
    let decriptado = decrypter.update(encriptedMsg[0],'hex','utf-8');
    decriptado += decrypter.final('utf-8')

    res.json({msg:decriptado, user:otherUser})
}

module.exports = {send,decrypt}