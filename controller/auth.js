const bcrypt = require('bcrypt');
const users = require('../db/user_manager');
const keyManager = require('../encryption/keys');

//Handles the Log-in authentication and sets all session values
async function login(req, res){
    const {nome, senha} = req.body;

    try{
        let user = await users.retrieveUserByName(nome);
        if(!user.res){
            res.json(user.res.msg)
            return;
        }else if (user.data==undefined){
            res.send('Usuário não encontrado!')
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

async function register(req, res){
    let {nome, senha} = req.body;

    if(nome == undefined || nome ==null || senha==undefined || nome==undefined){
        res.status(400).send('Confira todos os campos e tente novamente!')
        return;
    }
        
   if((await users.retrieveUserByName(nome)).data != undefined){
        res.status(409).send('Este nome de usuário já está sendo utilizado!')
        return;
   }

   let {public, private} = await keyManager.keyGen();

   // Note: please, if you are planning to use this code for a real production app, 
   // DO NOT save your user's public and private keys inside a database. In the case 
   // that all your data from the Database is leaked, it doesn't matter that the messages
   // are encrypted, since the keys will be at their disposal either way. For a method 
   // of storing these keys safely, I would recommend the use of a HSM (Hardware Security Module).

   if(await users.registerNewUser(nome,bcrypt.hashSync(senha,10),public,private)!=-1){
       res.status(200).send('Cadastro efetuado com sucesso!')
       return;
   };
        
}
module.exports = {login,logout, register}