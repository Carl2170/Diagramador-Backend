const { Sequelize } = require("sequelize");

require('dotenv').config();

const database= process.env.DB_NAME
const userName= process.env.DB_USERNAME
const password= process.env.DB_PASSWORD
const host= process.env.DB_HOST
const port=  process.env.DB_PORT

const dialect = process.env.DB_DIALECT

const sequelize = new Sequelize(database,userName,password,
    {   host:host,
        dialect:dialect,
        port:port,
    }
)

//para que no se vea en consola las consultas que se hacen en la BD
sequelize.options.logging=false


module.exports= sequelize