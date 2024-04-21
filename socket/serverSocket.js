// const express = require('express');
// var cors = require('cors');
// // const dbConnection = require('../connectBD');
// var utilsSocket= require('./socketEvents')

// const portSocket = 5000

// const app = express();
// //const server = require('http').Server(app);
// const http = require('http');
// const httpServer = http.createServer(app);

// const io = require('socket.io')(httpServer, {
//   cors:{
//     origin: 'http://localhost:4200'
//   }
// });
// app.use(express.urlencoded({extended:true}))
// app.use(express.json());
// app.use(cors());

// // app.use((req, res,next)=>{
// //   req.io=io;
// //   req.con = dbConnection;
// //   next();
// // })
// const socketEvents = require('./socketEvents');
// socketEvents(io);

// httpServer.listen(portSocket,()=>{
//   console.log("Servidor socket activo "+ portSocket);
// });





const express = require("express");
var cors = require('cors');
const { createServer } = require("http");
const { Server } = require("socket.io");
const { handleRoomConnection,
       handleUserDisconnection,
       handleAddBoundaryEvent,
      } = require("./socketFunctions");


const app = express();
app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use(cors());

const portSocket = 5000


const httpServer = createServer(app);
const io = new Server(httpServer, { 
  cors:{
      origin: 'http://localhost:4200'
      }
});
const crypto = require("crypto");
const randomId = () => crypto.randomBytes(8).toString("hex");

const { InMemorySessionStore } = require("./sessionStore");
const sessionStore = new InMemorySessionStore();
const users = [];
io.use(async (socket, next) => {

  const sessionID = socket.handshake.auth.sessionID;

  if (sessionID) {
    const session = await sessionStore.findSession(sessionID);
    if (session) {
      socket.sessionID = sessionID;
      socket.userID = session.userID;
      socket.username = session.username;
      return next();
    }
    console.log(' no recibi la sesion: '+ session);

  }
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.sessionID = randomId();
  socket.userID = randomId();
  socket.username = username;
  next();
});


io.on("connection", (socket) => {
  //guarda la sesion
  sessionStore.saveSession(socket.sessionID, {
    userID: socket.userID,
    username: socket.username,
    connected: true,
  });
  //emita la sesion
  socket.emit("session", {
    sessionID: socket.sessionID,
    userID: socket.userID,
  });

  // sessionStore.saveSession(socket.sessionID, {
  //   userID: socket.userID,
  //   username: socket.username,
  //   connected: true,
  // });



  //  socket.emit("session", {
  //     sessionID: socket.sessionID,
  //     userID: socket.userID,
  //   });

  socket.on('room-started', (data)=>{
 // handleRoomConnection(socket,data, io);

    if(!sessionStore.findSession(socket.userID)){
      sessionStore.findAllSessions().forEach((session) => {
        users.push({
          userID: session.userID,
          username: session.username,
          connected: session.connected,
        });
      });
    }

  console.log('sessionID: '+socket.sessionID);
  
  console.log(users);
});
 
  // notify users upon disconnection
  socket.on("user-desconnect", async (data) => {
    const matchingSockets = await io.in(socket.userID).allSockets();
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      console.log("se desconecto " + data.nameUser + " de la sala: "+ data.roomId);
      console.log("ya no hay sesion");
      // notify other users
//      socket.broadcast.emit("user-disconnected", socket.userID);
      // socket.emit('user-desconnect', { nameUser:da,roomId:idRoom });

// update the connection status of the session
      sessionStore.saveSession(socket.sessionID, {
        userID: socket.userID,
        username: socket.username,
        connected: false,
      });
      console.log(socket.connected);
    }else{
      console.log("no hallo nada en isdisconneted");
    }
  });

  });

  

httpServer.listen(portSocket,()=>{
  console.log("Servidor socket activo "+ portSocket);
});


