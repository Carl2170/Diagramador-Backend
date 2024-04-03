const User = require('./user')
const Room = require('./room')
const Collaborator = require('./collaborator')

async function sync(){
    try{
        await User.sync();
        await Room.sync({alter: true});
        await Collaborator.sync({alter: true});
        //sequelize.sync()   sincroniza todos los modelos
        console.log("Modelos sincronizados correctamente.");

    }catch(error){
        console.log("Error al exportar los modelos"+ error);
    }
} 

module.exports = sync;