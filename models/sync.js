const User = require('./user')
const Room = require('./room')

async function sync(){
    try{
        await User.sync();
        await Room.sync();
        console.log("Modelos sincronizados correctamente.");

    }catch(error){
        console.log("Error al exportar los modelos"+ error);
    }
} 

module.exports = sync;