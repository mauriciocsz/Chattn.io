const {RedisStore, redisClient} = require('./client')
const util = require('util')

let getHash = util.promisify(redisClient.hget).bind(redisClient);

async function getPublicKey(username){

    let resposta = await getHash('public_keys',username);
    return resposta;
}

module.exports = {getPublicKey}