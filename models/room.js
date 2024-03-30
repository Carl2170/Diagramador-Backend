const { DataTypes } = require('sequelize');
const sequelize = require('../connectBD');
const User = require('./user');

const Room = sequelize.define('Room', {
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement: true
        },
        name: {
            type:DataTypes.STRING,        
        }
    },
        {
            timestamps: false
    })
module.exports = Room;