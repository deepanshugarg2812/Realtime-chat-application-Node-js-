const express = require('express')
const app = express() //Creating the express object
const http = require('http')
const socketio = require('socket.io')

const server = http.createServer(app)
const io = socketio(server)

app.use('/',express.static(__dirname+'/public'))

//Keep the track of the ids
let socketId = {}

//To keep the user and password
let users = {};

io.on('connection',(socket)=>{

    //Event for the login
    socket.on('loginReq',(data)=>{
        if(data.user=='' || data.password=='' || users.hasOwnProperty(data.user) && users[data.user]!=data.password)
        {
            socket.emit('loginRes',{succ : "error"})
        }
        else{
            users[data.user] = data.password;
            socket.join(data.user)
            socketId[socket.id] = data.user
            socket.emit('loginRes',{succ : "Success"})
        }

    })
    //Event for login complete

    //Getting the send request
    socket.on('msgReq',(data) => {

        //if the user is not present broadcast
        if(data.user == ''){
            if(socketId.hasOwnProperty(socket.id))
            socket.broadcast.emit('msgRes',{userFrom : socketId[socket.id],msg : data.msg})
        }
        else{
            //For security purpose
            if(socketId.hasOwnProperty(socket.id))
            socket.to(data.user).emit('msgRes',{userFrom : socketId[socket.id],msg : data.msg})
        }

    })

})

server.listen(3333,() =>{
    console.log("Serve has started at the " + "http://localhost:3333")
})
