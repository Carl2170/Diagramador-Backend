const { DataTypes } = require('sequelize');
const sequelize = require('../connectBD');

const Room = sequelize.define('Room', {
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement: true
        },
        name: {
            type:DataTypes.STRING,        
        },
        status: {
            type:DataTypes.STRING,
            defaultValue: "off"
        }
    },
    
        {
            timestamps: false
    })
module.exports = Room;