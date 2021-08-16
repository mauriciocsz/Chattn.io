const crypto = require('crypto');

//  Secret key we use to encrypt the rooms
const key = '74e224decf0870311ff940a0cecd1d78';


function encryptRoom(user1, user2){
    

    let order = [user1,user2].sort() 
    
    const iv = crypto.randomBytes(16);

    //Encrypts the room name using our key & iv
    let cipher = crypto.createCipheriv('aes-128-cbc',Buffer.from(key,'hex'),iv);
    let cipher2 = crypto.createCipheriv('aes-128-cbc',Buffer.from(key,'hex'),iv);

    order[0] = cipher.update(order[0],'utf-8','hex')
    order[0] += cipher.final('hex')

    order[1] = cipher2.update(order[1],'utf-8','hex')
    order[1] += cipher2.final('hex')

    //  Returns the encrypted room in the format: user1_user2_iv
    let roomName= (order[0]+"_"+order[1]+'_'+iv.toString('hex'))
    return roomName;

}

function decryptRoom(room){

    // Splits the values where
    // 0 - User1,  1 - User 2 , 2 - IV
    let text = room.split('_')

    let decrypter = crypto.createDecipheriv('aes-128-cbc', Buffer.from(key,'hex'), Buffer.from(text[2],'hex'))
    let decrypter2 = crypto.createDecipheriv('aes-128-cbc', Buffer.from(key,'hex'), Buffer.from(text[2],'hex'))

    //  Decrypts the room and sends the users back in an array
    let user1 = decrypter.update(text[0],'hex','utf-8')
    user1+= decrypter.final('utf-8')
    let user2 = decrypter2.update(text[1],'hex','utf-8')
    user2+= decrypter2.final('utf-8')

    return [user1, user2];

}

module.exports = {encryptRoom,decryptRoom}