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

module.exports = {retrieveUserByName}