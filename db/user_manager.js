const query = require("./db_conn");

//Retrieves an user's data using his username
async function retrieveUserByName(nome){
    data = await query("select * from tb_users where nome = $1",[nome]);

    if(data==-1)
        return ({res:0, msg:"Um erro ocorreu! Tente novamente mais tarde."});
    else{
        return({res: 1, data: data.rows[0]})
    }  
    
}

async function registerNewUser(nome, senha, public, private){
    result = await query ("INSERT INTO tb_users (nome,senha,public_key,private_key) values ($1,$2,$3,$4);",[nome,senha,public,private]);

    if(data==-1)
        return ({res:0, msg:"Um erro ocorreu! Tente novamente mais tarde."});
    else{
        return data;
    }
}

module.exports = {retrieveUserByName,registerNewUser}