const express = require('express');
const path = require('path');
const router = express.Router();

const authController = require('./../controller/auth')

router.use(express.json());
router.use(express.urlencoded({extended: true}));

router.get('/', function(req,res){
    res.sendFile(path.resolve( __dirname+"/../view/index.html"));
})

router.use(express.static(path.resolve(__dirname+'/../view')));

// Handles the login authentication
router.post('/login', authController.login)

// If the user's session is null/undefined he 
// won't be able to access any routes below.
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