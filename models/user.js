const { DataTypes } = require('sequelize');
const sequelize = require('../connectBD');
const Room = require('./room');
const User = sequelize.define('User', {
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement: true
        },
        name: {
            type:DataTypes.STRING,        
        },
        lastname: {
            type:DataTypes.STRING,        
        },
        email: {
            type:DataTypes.STRING,        
        },
        password: {
            type:DataTypes.STRING,        
        },
    },
        {
            timestamps: false
    }
    )

User.hasMany(Room, { onDelete: 'CASCADE' });
Room.belongsTo(User);



module.exports = User;