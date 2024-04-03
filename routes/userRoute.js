const express = require('express');
const router= express.Router();
const { registerUser, loginUser, getUser, updateUser, getCollaborador, changePassword} = require('../controllers/auth');
require('dotenv').config();

var auth= require('../services/authentication')

router.post('/register',registerUser);

router.post('/login',loginUser);

router.get('/get',auth.authenticateToken, getUser);

router.patch('/update-user',auth.authenticateToken, updateUser);

router.get('/get-collaborator/:email',auth.authenticateToken, getCollaborador);

router.patch('/changePassword', auth.authenticateToken, changePassword);

module.exports= router