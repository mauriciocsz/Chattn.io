const express = require('express');
const path = require('path');

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended: true}));

router.use("/",express.static(path.resolve(__dirname+'/../view')));

router.get('/', function(req,res){
    res.sendFile(path.resolve( __dirname+"/../view/index.html"));
})

//TODO: Divide this into different 'modules'
router.post('/login', (req, res) =>{
    const {nome, senha} = req.body;
    const query = require("./db_conn");
    const bcrypt = require('bcrypt');

    query("select * from tb_users where nome=$1",[nome]).then(data =>{
        if(data==-1)
            res.json("Erro!")
        else{
            bcrypt.compare(senha, data.rows[0].senha).then(result =>{
                if(result){
                    req.session.username = data.rows[0].nome;
                    res.json("Login efetuado.")
                }
                else
                    res.json("Um erro ocorreu, cheque seu usuário e senha e tente novamente.")
            });
        }
    })
})

//If the user's session is null/undefined he won't
//be able to access any routes below.
router.use((req, res, next) =>{
    if(!req.session || !req.session.username){
        const err = new Error('Erro!')
        err.statusCode = 401;
        next(err);
    }

    next();
})

//Placeholder route just to check an user's session
router.get('/check', (req,res)=>{
    res.json("olá, "+req.session.username);
})

module.exports = router;