const Collaborator = require('../models/collaborator');
const Room = require('../models/room');
const User = require('../models/user');

const create= async (req, res)=>{
    try {
        const nameSala = req.body.name;
        const user = res.locals;   

       const room = await Room.create({
            name:nameSala,
            UserId:user.id
        });

        if(room) return res.status(200).json({message:"room created successfully"});

        return res.status(404).json({message:"error to create"});
    } catch (error) {
        
        return res.status(500).json({error:error.message});

    }
}

const update= async (req, res)=>{
    try {
        const nameRoom = req.body.name;
        const idRoom = req.params.id;
        const user = res.locals

        const room = await Room.findOne({where: { id:idRoom, UserId:user.id } });

        if(room){
            await room.update({name:nameRoom})
            return res.status(200).json({message:"room updated successfully."})
        }else{
            res.status(404).json({ error: 'room not found' });
        }

    } catch (error) {
        return res.status(500).json({error:error.message});
    }
}

const deleteRoom= async (req, res)=>{
    try {
        const user = res.locals
        const idRoom = req.params.id;

        const room = await Room.findOne({where: { id:idRoom, UserId:user.id } });

        if(room){
            await room.destroy();
            return res.status(200).json({message:"room deleted successfully."})
        }else{
            res.status(404).json({ error: 'room not found' });
        }
    } catch (error) {
        res.status(500).json({ error:error.message });

    }
}

const getRoomsCreate= async (req, res)=>{
  try {
    const user = res.locals
    const Rooms = await Room.findAll({where: { UserId:user.id }})

    if(Rooms.length > 0){
        return res.status(200).json(Rooms);
    }
  } catch (error) {
    return res.status(500).json({error: error.message});

  }

}

const addToCollaborators = async (req, res) => {
    try {
        const { user_id, room_id } = req.body
        await Collaborator.create({
            RoomId: room_id,
            UserId:user_id,
            status:'offline'
        });
       return res.status(200).json({message:'collaborator added successfully'})

    } catch (error) {
        res.status(500).json({error: error.message});
    }

};

const getRoomsColaborate = async( req, res)=>{ 
    try {
        let RoomsCollaborate=[];
        const user = res.locals;
        const rooms = await Collaborator.findAll({ attributes: ['RoomId'], where: { UserId:user.id }});
        const roomIds = rooms.map(room => room.dataValues.RoomId);

        if(rooms.length> 0){
            for (let index = 0; index < roomIds.length; index++) {
                const roomIdBD = roomIds[index];
                const room= await Room.findOne({where:{id:roomIdBD}})
                RoomsCollaborate.push(room)
            }
            return res.status(200).json(RoomsCollaborate);
        }
    } catch (error) {
        return res.status(500).json({error:error.message});

    }
   
}

async function getRoom (id){
    try {


    } catch (error) {
    
    }
}

async function verifUserRoom(user_id, room_id){
    try {
    const Collaborator = await Collaborator.findOne({where:{RoomId:room_id, UserId: user_id}})
    
    if(Collaborator.length >0){
        return true;
    }
    return false;
    } catch (error) {
        console.log("error: "+ error.message );
    }
}

async function verifAnfitrion( user_id, room_id){
    try {
       const Anfitrion= Room.findOne({where:{id:room_id, UserId: user_id}})
       
       if(Anfitrion) return true;

       return false;
    } catch (error) {
        console.log("error: "+ error.message );
    }
}

module.exports={create,update,deleteRoom,getRoomsCreate,addToCollaborators, getRoomsColaborate, getRoom, verifUserRoom, verifAnfitrion}