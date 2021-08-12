const redisDb = require('./../redis/storage')
const crypto = require('crypto')

async function send (req, res){
    let {msg, reciever} = req.body;
    let {privateKey, username} = req.session;

    try{
        let PublicKey = await redisDb.getPublicKey(reciever);
        
        let order = [reciever,username].sort() 
        const roomName= (order[0]+"_"+order[1])
        
        //Placeholder Key 
        let key ='12345678123456781234567812345678'

        const iv = crypto.randomBytes(16);
        let iv64 = iv.toString('base64')

        //Encrypt 
        const encrypter = crypto.createCipheriv('aes-256-cbc',key,iv);
        let result = encrypter.update(msg,'utf8', 'hex')
        result+= encrypter.final('hex')
        result+=" "+iv64


        //Decrypt
        let encriptedMsg = result.split(' ')
        const decrypter = crypto.createDecipheriv('aes-256-cbc',key,Buffer.from(encriptedMsg[1],'base64'));
        let decriptado = decrypter.update(encriptedMsg[0],'hex','utf-8');
        decriptado += decrypter.final('utf-8')

        
    }catch(error){
        console.log(''+error)
    }

}

module.exports = {send}