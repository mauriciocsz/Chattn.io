const query = require("./db_conn");

async function retrievePublicKeys(){
    result = await query('SELECT public_key, nome FROM tb_users');
    return result;
}

module.exports = {retrievePublicKeys}