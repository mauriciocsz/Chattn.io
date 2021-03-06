const express = require('express');
const app = new express();
const session = require('express-session');
const storage = require('./redis/storage')

const {RedisStore, redisClient} = require('./redis/client')

app.use(session({
    store: new RedisStore({client: redisClient}),
    //Placeholder secret, if you are going to use it for anything in production
    //please change it beforehand.
    secret: 'secret',
    saveUninitialized: false,
    resave: false,
    cookie: {
        secure: false, //keep it false only for debug purposes
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 24hrs
    }
}));

//Sets all keys on boot
storage.setAllKeys();

var http = require('http').createServer(app);

app.use(require("./src/routes"));

http.listen(process.env.PORT || 3000);

console.log("Running");

//Initializes the socket connection
const socket = require('./socket/connection')
socket.setIo(http)