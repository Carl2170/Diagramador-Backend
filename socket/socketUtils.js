const { verifUserRoom, verifAnfitrion } = require('../controllers/room')

async function joinRoom(socket,userId, roomId ) {
    const userExists = await verifUserRoom(userId, roomId);
    if (userExists==true) {
        socket.join(roomId);
        return true;
    } else {
        return false;
    }
}

async function verifHost(userId, roomId){
    return verifAnfitrion(userId, roomId);
}

function leaveRoom(socket, roomId) {
    socket.leave(roomId);
    // Lógica adicional si es necesario
}

// Más funciones de utilidades aquí...

module.exports = {
    joinRoom,
    leaveRoom,
    verifHost
    // Exportar más funciones aquí si es necesario
};