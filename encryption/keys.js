const crypto = require('crypto');

function keyGen(){
    let diffieGen = crypto.createECDH('secp256k1')
    diffieGen.generateKeys();

    return {public: diffieGen.getPublicKey('hex'), 
            private: diffieGen.getPrivateKey('hex')}
}

function getSecret(public, private){

    //Creates a Dummy holder so we can compute the secret
    var keyHolder = crypto.createECDH('secp256k1')
    keyHolder.setPrivateKey(Buffer.from(private,'hex'))

    return (keyHolder.computeSecret(public, 'hex', 'hex'));
}


module.exports = {keyGen, getSecret}