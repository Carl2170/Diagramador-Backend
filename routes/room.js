const express = require('express');
const connection = require('../connection');
const router= express.Router();


require('dotenv').config();

var auth= require('../services/authentication')

router.post('/create', auth.authenticateToken,(req,res)=>{  
    let project = req.body;
    let user = res.locals;
    query = "INSERT INTO project (name) value(?)";
    connection.query(query, [project.name], (err, results)=>{
        if(!err){
            let projectId = results.insertId;

           // return res.status(200).json({message:"room created successfully"});
            query2 = "INSERT INTO room (project_id, host_id) VALUES(?, ?)";
            connection.query(query2,[projectId,user.id],(err, roomResult)=>{
                if(!err){
                    return res.status(200).json({message:"room created successfully"});
                }else{
                    return res.status(500).json({message:"error to create room"});

                }
            })
        }else{
            return res.status(500).json({message:"error "+ err});                      
        }
    })
})

router.delete('/delete-room/:id', auth.authenticateToken,(req,res)=>{
    let id = req.params.id;
    let room;
    getRoom(id, (error, registro) => {
        if (error) {
          console.error('Error to obtain register:', error);
        } else {
          room = registro.id;
        }
      });
    var query= "DELETE FROM room WHERE id = ?";
    connection.query(query, [room], (err, results)=>{
        if(!err){
          var query2 = "DELETE FROM project WHERE id = ?";
            connection.query(query2,[id],(err, results)=>{
                if(!err){
                    return res.status(200).json({message:"room and project deleted successfully"});
                }else{
                    return res.status(500).json({message:"error to deleted room or project"}+err);
                }
            })
        }else{
            return res.status(500).json(err);
        }
    })
})

router.get('/get-rooms',auth.authenticateToken, (req,res)=>{
    let user = res.locals;
    var query = "SELECT project.id, project.name FROM project,room WHERE project.id = room.project_id AND room.host_id= ?";
    connection.query(query, [user.id],(err, results)=>{
        if(!err){
            return res.status(200).json(results);
        }else{
            return res.status(500).json(err);
        }
    })
})

function getRoom(id, callback){
    const query = 'SELECT * FROM room WHERE room.project_id = ?';
    connection.query(query, [id],(error, results)=>{
        if(error){
            callback(error,null);
        }else{
            callback(null, results[0]); // Se asume que solo se espera un único registro
        }
    })
}

module.exports= router