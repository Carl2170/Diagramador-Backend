const express = require('express');
const router= express.Router();
const {addToCollaborators, getRoomsColaborate, create, update, getRoomsCreate, deleteRoom} = require('../controllers/room')

require('dotenv').config();

var auth= require('../services/authentication')

router.post('/create',auth.authenticateToken, create );

router.patch('/update/:id',auth.authenticateToken, update );

router.delete('/delete-room/:id', auth.authenticateToken,deleteRoom);

router.get('/get-rooms',auth.authenticateToken, getRoomsCreate);

router.post('/to-add-collaborators', addToCollaborators)

router.get('/rooms-colaborate',auth.authenticateToken, getRoomsColaborate)

module.exports= router