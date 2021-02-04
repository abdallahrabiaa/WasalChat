const express = require('express');
const app =express();
const path =require('path');
const http = require('http');
const socketio =require('socket.io')
const {formatMessage} =require('./utils/message');
const {getCurrentUser,userJoin,getRoomUsers,userLeave}=require('./utils/users')
const dotenv= require('dotenv').config();
const server =http.createServer(app);
const io = socketio(server);
const port =4000||process.env.PORT;
const Bot= 'Wasal'
app.use(express.static(path.join(__dirname,'public')))
io.on('connection',socket=>{
    socket.on('JoinRoom',({username,room})=>{
        const user=userJoin(socket.id,username,room);
        socket.join(user.room);
        socket.emit('message',formatMessage(Bot,"Welcome in wasal chat App !"));
        socket.broadcast.to(user.room).emit('message',formatMessage(Bot,`${user.username} has joined the chat !`));
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getRoomUsers(user.room)
        })
    })
    socket.on('chatMsg',(message)=>{
        const user= getCurrentUser(socket.id);
        io.to(user.room).emit('message',formatMessage(user.username,message))
    })
    socket.on('disconnect',()=>{
        const user= userLeave(socket.id);
        if (user)
        io.to(user.room).emit('message',formatMessage( Bot,` ${user.username} has left the chat !`))
    })
    
  

})


server.listen(port,()=>console.log(`server is running on port ${port}`));
