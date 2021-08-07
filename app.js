const express = require('express');
const app = new express();

var http = require('http').createServer(app);

var io = require('socket.io')(http);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(require("./src/routes"));
app.use("/",express.static(__dirname+'/view'));

http.listen(process.env.PORT || 3000);

console.log("Running");