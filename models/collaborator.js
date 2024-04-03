const { DataTypes } = require('sequelize');
const sequelize = require('../connectBD');
const User = require('./user');
const Room = require('./room');

const Collaborator = sequelize.define('Collaborator', {
    RoomId:{
        type:DataTypes.INTEGER,
        references: {
            model:Room,
            key: 'id'
        }
    },
    UserId: {
        type:DataTypes.INTEGER,
        references: {
            model:User,
            key: 'id'
        }        
    },
    status: {
        type:DataTypes.STRING,
    }
},
    {
        timestamps: false
});

Room.belongsToMany(User, { through: Collaborator});
User.belongsToMany(Room, { through: Collaborator});


module.exports = Collaborator;