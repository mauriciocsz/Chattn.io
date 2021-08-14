const {RedisStore, redisClient} = require('./client')
const keyMan = require('./../db/key_manager');
const util = require('util')

let getHash = util.promisify(redisClient.hget).bind(redisClient);
let setKey = util.promisify(redisClient.hmset).bind(redisClient);

async function getPublicKey(username){

    let resposta = await getHash('public_keys',username);
    return resposta;
}

//Gets the PUBLIC keys from all users and set their values in a 
//Redis Hashtable.
async function setAllKeys(){
    try{
        let data = await keyMan.retrievePublicKeys()
        for(let x=0;x<data.rowCount;x++){
            await setKey('public_keys', data.rows[x].nome, data.rows[x].public_key)
        }
    }catch(err){
        console.log(err)
    }
}

async function setNewKey(data){
    try{
        await setKey('public_keys',data.nome,data.public)
    }catch(err){
        console.log(err)
    }
}

module.exports = {getPublicKey, setAllKeys, setNewKey}