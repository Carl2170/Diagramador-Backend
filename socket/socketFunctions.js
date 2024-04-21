
const usersConected = {};
const usersState= {
    users:[],
    setUsers:function(newUsersArray){
      this.users= newUsersArray
    }
  }

function handleRoomConnection(socket, data, io) {

    // if (!usersConected[data.roomId]) {
    //     usersConected[data.roomId] = [];
    // }

    // if (!isUserConnected(usersConected[data.roomId], data.nameUser)) {
    //     socket.join(data.roomId);
    //     addUser(usersConected[data.roomId], data.nameUser);
    // } else {
    //     connectUser(usersConected[data.roomId], data.nameUser);
    //     socket.join(data.roomId);
    // }

   // const prevRoom= getUser(socket.id)?.room
    // if (prevRoom) {
    //     socket.leave(prevRoom)
    //     io.to(prevRoom).emit('user-desconnected', { nameUser: data.nameUser })
    // }

    // const user= activateUser(socket.id, data.nameUser, data.roomId)
    
    // if (prevRoom) {
    //     const lis1= getUsersInRoom(prevRoom)
    //     io.to(prevRoom).emit('table-user-actualice', lis1)
    // } 

    //join room
    console.log(socket.userID);
    // socket.join(user.room)

    // socket.emit('user-connected', { nameUser: data.nameUser });

    // socket.broadcast.to(user.room).emit('user-connected', {nameUser:data.nameUser})

    //io.to(data.roomId).emit('user-connected', {nameUser:data.nameUser});

    //++++io.to(data.roomId).emit('room-started', { nameUser: data.nameUser });

   // var listUsersConnected = getConnectedUsers(usersConected[data.roomId]);

    // io.to(data.roomId).emit('table-user-update', listUsersConnected);
    const list2= getUsersInRoom(user.room)
    io.to(user.room).emit('table-user-actualice',list2);
    //console.log(list2);
    
}

function handleUserDisconnection(socket, data,io) {
    const user= getUser(socket.id)
    userLeaves(socket.id)

    if(user){
        io.to(user.room).emit('user-desconnected', { nameUser: data.nameUser });
        const listUsers= getUsersInRoom(user.room)
        io.to(user.room).emit('table-user-actualice', listUsers);
         socket.broadcast.to(user.room).emit('user-desconnected', { nameUser: data.nameUser })
         socket.leave(user.room)
         console.log(listUsers)
        }
    // disconnectUser(usersConected[data.roomId], data.nameUser);
    // socket.emit('user-desconnected', { nameUser: data.nameUser });

    // var listUsersConnected = getConnectedUsers(usersConected[data.roomId]);
    // io.to(data.roomId).emit('table-user-actualice', listUsersConnected);
    // socket.leave(data.roomId);  
    console.log(`usuario ${data.nameUser} se ha desconectado`);

}

function handleAddBoundaryEvent(socket, data, io) {

    console.log(`User: ${data.nameUser}, Room: ${data.roomId}`);
       const socketsInRoom = getConnectedSocketsInRoom(data.roomId,io);
        socketsInRoom.forEach(socket => {
            socket.emit('add-boundary1', { message: 'Carla Andrea Vaca Negrete' });
        console.log(socketsInRoom);
    });
    io.to(data.roomId).emit('add-boundary1',{ message: 'se agrego un boundary' } );

}

function isUserConnected(arrayRoom, nameUser) {
    return arrayRoom.some(user => user.nameUser === nameUser && user.status === 'connected');
}

function getConnectedUsers(array) {
    var arrayUser = [];
    if(Array.isArray(array)){
  
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        if(element.status === "connected")
          arrayUser.push(element.nameUser)
      }
      return arrayUser;
    }}

function addUser(arrayRoom, nameUser) {
    arrayRoom.push({ nameUser: nameUser, status: 'connected' });
}

function connectUser(arrayRoom, nameUser) {
    arrayRoom.forEach(user => {
        if (user.nameUser === nameUser) {
            user.status = 'connected';
        }
    });
}

function disconnectUser(arrayRoom, nameUser) {
   if(Array.isArray(arrayRoom)){
    arrayRoom.forEach(user => {
        if (user.nameUser === nameUser) {
            user.status = 'disconnected';
        }
    });
   }
}

function getConnectedSocketsInRoom(roomId,io) {
    const sockets = io.sockets.sockets;
    return Object.values(sockets).filter(socket => socket.rooms.has(roomId));
}

function activateUser(id, name, room){
    const user= {id, name, room}
    usersState.setUsers([
      ...usersState.users.filter(user => user.id !== id),
      user
    ])
    return user
  }
  
function userLeaves(id){
usersState.setUsers(
    usersState.users.filter(user => user.id !== id)
)
}

function getUser(id){
return usersState.users.find(user => user.id === id)
}

function getUsersInRoom(room){
return usersState.users.filter(user => user.room === room)
}

function getAllActiveRooms(){
return Array.from(new Set(usersState.users.map(user=>user.room)))
}

module.exports = {
    handleRoomConnection,
    handleUserDisconnection,
    handleAddBoundaryEvent,
}