const express = require('express');
const connection = require('../connection');
const router= express.Router();

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

require('dotenv').config();

var auth= require('../services/authentication')

router.post('/register', (req,res)=>{
    let user = req.body;
    query = "SELECT email, password, status FROM users WHERE email = ?";
    connection.query(query, [user.email], (err, results)=>{
        if(!err){ 
            if(results.length <=0){
                query= "INSERT INTO users(name, lastname, email, password, status) value (?,?,?,?,'false')";
                connection.query(query,[user.name, user.lastname, user.email, user.password],(err,results)=>{
                    if(!err){
                        return res.status(200).json({message:"Successfully registered"});
                    }else{
                        return res.status(500).json(err);                      
                    }
                })

          }else{{
                return res.status(400).json({message: "Email already exist."});    
            }}
        }else{
            return res.status(500).json(err);
        }
    })
})

router.post('/login', (req,res)=>{
    const user = req.body;
    query="SELECT id,name,lastname,email, password, status FROM users where email =?";
    connection.query(query, [user.email], (err,results)=>{
        if(!err){
            if(results.length <=  0 || results[0].password != user.password){
                return res.status(401).json({message:"Incorrect username o password"}) 
            }else if(results[0].password == user.password){
                const response = {  id:results[0].id,
                                    name:results[0].name,
                                    lastname:results[0].lastname,
                                    email:results[0].email,
                                    };
                const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN,{
                    expiresIn:"8h",
                });
                return res.status(200).json({token:accessToken});

            }else{
                return res.status(400).json({message:"Something went wrong: Please try again later"});
                
            }
        }else{
            return res.status(500).json(err);
        }

    })
});

router.get('/get-users',auth.authenticateToken, (req,res)=>{
    var query = "SELECT id, name, lastname, email FROM users";
    connection.query(query, (err, results)=>{
        if(!err){
            return res.status(200).json(results);
        }else{
            return res.status(500).json(err);
        }
    })
})

router.patch('update-user', (req, res)=>{
    let user= req.body;
    var query = "UPDATE users SET name=?, lastname=?, email=? WHERE id=?";
    connection.query(query,[user.name, user.lastanme, user.email, user.id], (err, results)=>{
        if(!err){
            if(results.affectedRows ==0){
                return res.status(404).json({message:"user id don´t not exist."})
            }
            return res.status(200).json({message:"user updated successfully."})
        }else{
            return res.status(500).json(err);
        }
    })
})

router.get('/checkToken', (req, res)=>{
    return res.status(200).json({message: "true"});
})
 

router.post('/changePassword', auth.authenticateToken, (req,res)=>{
    const user = req.body;
    const email = res.locals.email;
    var query= "SELECT * FROM users WHERE email = ? and password =?";
    connection.query(query, [email, user.oldPassword], (err,results)=>{
        if(!err){
            if(results.length<=0){
                return res.status(400).json({message:"incorrect password"});
            }else if(results[0].password == user.oldPassword){
                query = "UPDATE users set password=? WHERE email=?";
                connection.query(query,[user.newPassword,email], (err, results)=>{
                    if(!err){
                        return res.status(200).json({message:"password updated successfully"});
                    }else{
                        return res.status(500).json(err);
                    }
                })
                
            }else{
                return res.status(400).json({message:"something weng wrong. Please try again later"});
            }
        }else{
            return res.status(500).json(err);
        }
    })

})
module.exports= router