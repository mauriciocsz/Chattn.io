const crypto = require('crypto');

function keyGen(){
    let diffieGen = crypto.getDiffieHellman('modp15');
    diffieGen.generateKeys();

    return {public: diffieGen.getPublicKey('hex'), 
            private: diffieGen.getPrivateKey('hex')}
}

function getSecret(public, private){
    //Prime number used for the encoding in Hex
    let primeHex = 'ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a93ad2caffffffffffffffff'
    let primeBuff = Buffer.from(primeHex,'hex')

    //Dummy DiffieHellman we create so we can compute the secret
    var keyHolder = crypto.createDiffieHellman(primeBuff)
    keyHolder.setPrivateKey(Buffer.from(private,'hex'))

    return (keyHolder.computeSecret(public, 'hex', 'hex'));
}


module.exports = {keyGen, getSecret}