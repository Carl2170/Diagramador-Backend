const usersConected =  {}; 


module.exports = (io) => {
    io.on('connect', (socket) => {
      //CONEXION DE SALA
      socket.on('room-started', async (data) => {
        //si no existe la sala, se crea una lista de la sala
        if (!usersConected[data.roomId]) {usersConected[data.roomId] = []}
        //se verifica si el usuario no existe en la sala
        if(!verifUserConect(usersConected[data.roomId],data.nameUser)){                                             
          socket.join(data.roomId);
          //se crea el usuario con su estado
          var userStatus = { nameUser:data.nameUser, status:"connected"}
          usersConected[data.roomId].push(userStatus);
          //en caso de que exista pero que su estado esté con "desconneted", se cambia a "connected"
        }else{
          userConnect(usersConected[data.roomId], data.nameUser);
          socket.join(data.roomId);
        }
        console.log(usersConected);
         // Obtenemos la lista de sockets conectados al servidor
      const sockets = io.sockets.sockets;
  
      // Filtramos los sockets para encontrar los que están en la sala específica
      const socketsInRoom = Object.values(sockets).filter(socket => socket.rooms.has(data.roomId));
  
      console.log('Sockets en la sala ' + data.roomId + ':', socketsInRoom.map(socket => socket.id));
        //se emite el mensaje de conexion del usuario
        socket.emit('user-connected', { nameUser:data.nameUser });
        //se emite el mensaje de conexion a los demas
        io.to(data.roomId).emit('user-connected', {nameUser:data.nameUser});
        //se enviar su nombre a la sala
        io.to(data.roomId).emit('room-started', {nameUser:data.nameUser});
        //se obtiene la lista de los conectados
        var listUsersConnected= getUsersConnected(usersConected[data.roomId]);
        //se envia la lista a la sala
        io.to(data.roomId).emit('table-user-actualice', listUsersConnected);
        });
      
      //DESCONEXION DE LA SALA
      socket.on('user-desconnect',(data)=>{
        //se cambia el estado del usuario
        userDesconnect(usersConected[data.roomId],data.nameUser);
        //se emite el mensaje de desconexion del usuario
        socket.emit('user-desconnected', { nameUser:data.nameUser });
         //se emite el mensaje de desconexion a los demas
        io.to(data.roomId).emit('user-desconnected', {nameUser:data.nameUser});
        //se actualiza la tabla de usuarios desconectados
        var listUsersConnected= getUsersConnected(usersConected[data.roomId]);
        io.to(data.roomId).emit('table-user-actualice',listUsersConnected);
        socket.leave(data.roomId);
      })

    //DIAGRAMA
    //INSERCIONES DE COMPONENTES
    //BOUNDARY
    socket.on('add-boundary',(data)=>{
      console.log('El usuario: ' + data.nameUser + ' en la sala: ' + data.roomId);

      // Obtenemos la lista de sockets conectados al servidor
      const sockets = io.sockets.sockets;
  
      // Filtramos los sockets para encontrar los que están en la sala específica
      const socketsInRoom = Object.values(sockets).filter(socket => socket.rooms.has(data.roomId));
  
      console.log('Sockets en la sala ' + data.roomId + ':', socketsInRoom.map(socket => socket.id));
  
      // Enviamos un mensaje a cada socket en la sala (opcional)
      socketsInRoom.forEach(socket => {
          socket.emit('add-boundary1', { message: 'Carla Andrea Vaca Negrete' });
      });
  });

    //  var message='Carla Andrea Vaca Negrete'
    //    io.to(data.roomId).emit('add-boundary1', { message:message });
      //socket.emit('add-boundary1', { message:message });
 
  
    });  

 
  };

function verifUserConect(arrayRoom, nameUser){
    for (let index = 0; index < arrayRoom.length; index++) {
      const element = arrayRoom[index];
      if(element.nameUser === nameUser)
        return true;
    }
    return false;
}

function getUsersConnected(array){
  var arrayUser = [];
  if(Array.isArray(array)){

    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      if(element.status === "connected")
        arrayUser.push(element.nameUser)
    }
    return arrayUser;
  }
}

function userDesconnect(arrayRoom,nameUser){
  if(Array.isArray(arrayRoom)){
    for (let index = 0; index < arrayRoom.length; index++) {
      const element = arrayRoom[index];
      if(element.nameUser == nameUser){
        element.status = "desconnected";
      }
    }
  }
}

function userConnect(arrayRoom,nameUser){
  if(Array.isArray(arrayRoom)){
    for (let index = 0; index < arrayRoom.length; index++) {
      const element = arrayRoom[index];
      if(element.nameUser == nameUser){
        element.status = "connected";
      }
    }
  }
} 