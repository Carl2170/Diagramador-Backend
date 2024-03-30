const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const utilsSocket = require('./socketUtils')

const port = 5000;

app.use(cors());
const options = {
  cors: {
    origin: 'http://localhost:4200',
  },
}; // Habilitar CORS

const server = require('http').Server(app);
const io = require('socket.io')(server, options);

io.on('connection', (socket) => {

  socket.on('room-started', (data) => {
    //verificar si es anfitrion o colaborador
    if(utilsSocket.verifHost(data.userId, data.roomId)==true)  console.log(`El usuario: ${data.nameUser} es anfitrion y ha iniciado la sala: ${data.roomId} `);

    console.log(`El usuario: ${data.nameUser} es colaborador y se ha unido a la sala ${data.roomId}`);

    // console.log(`El usuario: ${data.nameUser} ha iniciado la sala:`, data.nameRoom);
  });

  socket.on('room-closed', (data) => {
    console.log(`La sala: ${data.nameRoom} se ha cerrado`);
  });

  socket.on('disconnect-user', (data) => {
    console.log(`El usuario ${data.userName} se ha desconectado`);
});

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

});

server.listen(port, () => {
  console.log(`>>Socket listo y escuchando en el puerto: ${port}`);
});
