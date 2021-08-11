const express = require('express');
const app = new express();
const session = require('express-session');
const redis = require('redis');
const connRedis = require('connect-redis');

const RedisStore = connRedis(session);


//Creates a client with redis
const redisClient = redis.createClient({
    port: 6379,
    host: 'localhost'
})

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
        maxAge: 1000 * 60 * 60 // 1h
    }
}));

var http = require('http').createServer(app);

var io = require('socket.io')(http);

app.use(require("./src/routes"));

http.listen(process.env.PORT || 3000);

console.log("Running");
