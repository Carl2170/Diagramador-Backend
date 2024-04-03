const express = require('express');
var cors = require('cors');
// const dbConnection = require('../connectBD');
var utilsSocket= require('./socketEvents')

const portSocket = 5000

const app = express();
//const server = require('http').Server(app);
const http = require('http');
const httpServer = http.createServer(app);

const io = require('socket.io')(httpServer, {
  cors:{
    origin: 'http://localhost:4200'
  }
});
app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use(cors());

// app.use((req, res,next)=>{
//   req.io=io;
//   req.con = dbConnection;
//   next();
// })
const socketEvents = require('./socketEvents');
socketEvents(io);

httpServer.listen(portSocket,()=>{
  console.log("Servidor socket activo "+ portSocket);
});

//module.exports = httpServer

//const options = {cors: {origin: 'http://localhost:4200'}};

// require('dotenv').config();
// const portSocket= 5000;


// const io = require('socket.io')(server, options);
// io.on('connection', (socket) => {
// try {
//   socket.on('room-started', (data) => {
//     //verificar si es anfitrion o colaborador
//      if( utilsSocket.verifHost(data.userId, data.roomId)==true)  console.log(`El usuario: ${data.nameUser} es anfitrion y ha iniciado la sala: ${data.roomId} `);

//     // console.log(`El usuario: ${data.nameUser} es colaborador y se ha unido a la sala ${data.roomId}`);

//      console.log(`El usuario: ${data.nameUser} ha iniciado la sala:`, data.nameRoom);
//   });
// } catch (error) {
  
// }
  

//   socket.on('room-closed', (data) => {
//     console.log(`La sala: ${data.nameRoom} se ha cerrado`);
//   });

//   socket.on('disconnect-user', (data) => {
//     console.log(`El usuario ${data.userName} se ha desconectado`);
// });

//INGRESO DEL COLABORADOR A LA SALA
// socket.on('join-room', (data) => {
//   try {
//     console.log(data);
//     if(  utilsSocket.joinRoom(socket,data.userId,data.roomId)==true){
//       console.log("pertenece a la sala");
//       // Emitir un mensaje de confirmación al cliente
//       socket.emit('room-joined', `Te has unido a la sala ${data.roomId}`);
  
//       // Notificar a otros usuarios en la sala sobre el nuevo usuario
//       socket.to(data.roomId).emit('user-joined', `Nuevo usuario se ha unido a la sala`);
//     }else{
//       console.log("no pertenece a la sala");

//       socket.emit('user-no-found', `No tienes permiso para ingresar`);
//     }
//   } catch (error) {
//       console.log(error);
//   }
 
// });

//});


// server.listen(portSocket,()=>{
//   console.log("Servidor socket activo ");
// });

// server.on('error', (error) => {
//   console.error('Error al iniciar el servidor socket:', error);
// });
