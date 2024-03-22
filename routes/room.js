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

module.exports= router