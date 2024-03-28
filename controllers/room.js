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
        var query= 'SELECT project.id, project.name FROM project,room,collaborators,users WHERE project.id = room.project_id and room.id = collaborators.room_id and collaborators.user_id = users.id and users.id =?';
        const results= await new Promise((resolve, reject) => {
            connection.query(query, [user.id], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        if(results.length>0) return res.status(200).json(results);

        return res.status(404).json({message:"Not found rooms colaborate"});

    } catch (error) {
        return res.status(400).json(error)
    }
   
}

async function getRoom (result){
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
module.exports={addToCollaborators, getRoomsColaborate, getRoom}