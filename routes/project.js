const express = require('express');
const connection = require('../connection');
const router= express.Router();


require('dotenv').config();

var auth= require('../services/authentication')

router.post('/create', auth.authenticateToken,(req,res)=>{
    let project = req.body;
    query = "INSERT INTO project (name)value(?)";
    connection.query(query, [project.name], (err, results)=>{
        if(!err){
            return res.status(200).json({message:"project created successfully"});
        }else{
            return res.status(500).json({message:"error "+ err});                      
        }
    })
})

router.get('/get/:id', auth.authenticateToken,(req, res)=>{
    let id = req.params.id;
    var query = "SELECT id, name FROM project WHERE id =?";
    connection.query(query, id,(err, results)=>{
        if(!err){
            if(results.length == 0){
                return res.status(404).json({message:"project id don´t not exist."})
            }
            return res.status(200).json(results)
        }else{
            return res.status(500).json(err);
        }
    })
})

router.get('/get-projects',auth.authenticateToken, (req,res)=>{
    var query = "SELECT id, name FROM project";
    connection.query(query, (err, results)=>{
        if(!err){
            return res.status(200).json(results);
        }else{
            return res.status(500).json(err);
        }
    })
})

router.patch('/update',auth.authenticateToken, (req, res)=>{
    let project= req.body;
    var query = "UPDATE project SET name=? WHERE id=?";
    connection.query(query,[project.name, project.id], (err, results)=>{
        if(!err){
            if(results.affectedRows ==0){
                return res.status(404).json({message:"project id don´t not exist."})
            }
            return res.status(200).json({message:"project updated successfully."})
        }else{
            return res.status(500).json(err);
        }
    })
})

router.delete('/delete/:id',auth.authenticateToken, (req, res) => {
    const id = req.params.id;
    var sql = 'DELETE FROM project WHERE id = ?';
    connection.query(sql, id, (err, results) => {

        if(!err){
            if(results.affectedRows ==0){
                return res.status(404).json({message:"project id don´t not exist."})
            }
            return res.status(200).json({message:"project deleted successfully."})
        }else{
            return res.status(500).json(err);
        }
    });
  });

module.exports= router