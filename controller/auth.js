const bcrypt = require('bcrypt');
const users = require('../db/user_manager');

//Handles the Log-in authentication and sets all
//session values
async function login(req, res){
    const {nome, senha} = req.body;

    try{
        let user = await users.retrieveUserByName(nome);
        if(!user.res){
            res.json(user.res.msg)
            return;
        }
        bcrypt.compare(senha, user.data.senha).then(result =>{
        if(result){
            req.session.username = user.data.nome;
            res.json("Login efetuado.")
        }
        else
            res.json("Um erro ocorreu, cheque seu usuário e senha e tente novamente.");
        })
    }catch(err){
        res.json("Um erro ocorreu! Tente novamente mais tarde.")
    }

    
}

function logout(req, res){
    req.session.destroy( () =>{
        res.json('Logout executado com sucesso.')
    })
}

module.exports = {login,logout}