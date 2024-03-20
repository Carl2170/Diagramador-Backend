const express = require('express');
const app = express();

const cors = require('cors');

app.use(cors());
const options = {
  cors: {
    origin: 'http://localhost:4200',
  },
}; // Habilitar CORS

const server = require('http').Server(app);
const io = require('socket.io')(server,options);

io.on('connection',(socket)=>{
    const idHandShake = socket.id;
    const { nameRoom } = socket.handshake.query;
    
    socket.join(nameRoom);
    console.log(  `Hola dispositivo ${idHandShake} se unió a la sala:-> ${nameRoom}`);

    socket.on('event',(res)=>{
        const data = res
        console.log(res);

    //manda a todos incluyendo al que manda osea al autor mas
    //socket.emit(nameRoom).emit('event',data)

    //manda a todos sin incluir al que manda
    socket.to(nameRoom).emit('event',res)
    });

})

server.listen(5000,()=>{
    console.log('>>Socket listo y escuchando en el puerto 5000');
})