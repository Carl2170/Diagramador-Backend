const express = require('express');
var cors = require ('cors');
const connection = require('./connection');

//routes
const userRoute = require('./routes/userRoute');
const projectRoute = require('./routes/project');
const projectRoom = require('./routes/room');

const app= express();

app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use('/users',userRoute);
app.use('/project',projectRoute);
app.use('/room',projectRoom);


module.exports= app;