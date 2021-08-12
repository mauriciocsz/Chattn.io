const express = require('express');
const path = require('path');
const router = express.Router();

//Controllers
const authController = require('./../controller/auth')
const messageController = require('./../controller/message')
const middlewares = require('./../controller/middleware')

router.use(express.json());
router.use(express.urlencoded({extended: true}));

router.get('/', (req,res) =>{
    res.sendFile(path.resolve( __dirname+"/../view/index.html"));
})

router.use(express.static(path.resolve(__dirname+'/../view')));

// Handles the login authentication
router.post('/login', authController.login)

// Logs out the user
router.post('/logout', authController.logout)

// If the user's session is null/undefined he 
// won't be able to access any routes below.
router.use(middlewares.sessionAuth);

//Placeholder route just to check an user's session
router.get('/check', (req,res)=>{
    res.json("olá, "+req.session.username);
})

router.post('/sendMessage', messageController.send)

module.exports = router;