const express = require('express');
const connection = require('../connection');
const router= express.Router();
const { registerUser, loginUser, getUser, updateUser} = require('../controllers/auth');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

require('dotenv').config();

var auth= require('../services/authentication')

router.post('/register',registerUser);

router.post('/login',loginUser);

router.get('/get',auth.authenticateToken, getUser);

router.patch('/update-user',auth.authenticateToken, updateUser);

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