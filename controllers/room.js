const connection = require('../connection');

const addToCollaborators = async (req, res) => {
    try {
        query = "INSERT INTO collaborators (user_id, room_id) VALUES (?, ?)";
        await new Promise((resolve, reject) => {
            connection.query(query, [req.body.user_id,req.body.room_id], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        return res.status(200).json({message:'collaborators added successfully'})
       
    } catch (error) {
        return res.status(401).json(error);
    }
};

const getRoomsColaborate = async( req, res)=>{
    try {
        let user = res.locals;
        var query= 'SELECT  project.name, room.id FROM project,room,collaborators,users WHERE project.id = room.project_id and room.id = collaborators.room_id and collaborators.user_id = users.id and users.id =?';
        const results= await new Promise((resolve, reject) => {
            connection.query(query, [user.id], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });   
            return res.status(200).json(results);
     
    } catch (error) {
        return res.status(400).json(error)
    }
   
}

async function getRoom (id){
    try {
        query = "SELECT * FROM room WHERE id = ?";
        const room = await new Promise((resolve, reject) => {
            connection.query(query, [id], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        return room;
       
    } catch (error) {
        return null;
    }
}

async function verifUserRoom(user_id, room_id){
    try {
        query = "SELECT * FROM collaborators WHERE user_id = ? AND room_id = ?";
        const room = await new Promise((resolve, reject) => {
            connection.query(query, [user_id, room_id], (err, results) => {
                if (err) reject(err); 
                else resolve(results);
            });

        });
        console.log(room);
        if(room.length>0){
            return true;
        }else{
            return false;
        }
       
    } catch (error) {
        return false;
    }
}

async function verifAnfitrion( user_id, room_id){
    try {
        console.log("antes");
        query = "SELECT * FROM room WHERE id = ? AND host_id = ?";
        const res = await new Promise((resolve, reject) => {
            connection.query(query, [room_id,user_id], (err, results) => {
                if (err) reject(err); 
                else resolve(results);
            });
        });
        console.log("llegue aca");
        console.log(res);
        if(res.length > 0 ){
            return true;
        }else{
            return false;
        }
    } catch (error) {
        console.log("error :"+ error);
        return false;
    }
}

module.exports={addToCollaborators, getRoomsColaborate, getRoom, verifUserRoom, verifAnfitrion}