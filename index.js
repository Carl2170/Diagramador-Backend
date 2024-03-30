const express = require('express');
const sequelize = require('./connectBD');
 const sync= require('./models/sync')
var cors = require ('cors');
const connection = require('./connection');

async function startApp() {
    try {
        await sequelize.authenticate();
        console.log('Conectado a la base de datos.');
        // Otro código de inicialización de la aplicación aquí
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        // Manejo de errores adicional si es necesario
    }
}
startApp();
sync();

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