const {encrypt, compare} = require('../helpers/bcrypt');
//const connection = require('../connection');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models/user');


const registerUser = async (req, res) => {
    try {
        const {name, lastname, email, password} = req.body;
        const hashPassword = await encrypt(password);
        const newUser = await User.create({
            name:name,
            lastname:lastname,
            email:email,
            password:hashPassword
        });
        res.status(201).json({message:"Successfully registered"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

const loginUser = async(req, res)=>{
    try{
        const { email, password} = req.body
        const user = await User.findOne({ where: { email: email } });
        
        if(user){
            const checkPassword = await compare(password, user.password);

            if(checkPassword){
                const response ={
                    id:user.id,
                    name:user.name,
                    lastname:user.lastname,
                    email:user.email,
                }

                const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN,{expiresIn:"8h",});
         
               return res.status(200).json({token:accessToken, name:user.name, id:user.id});

            }else{
                return res.status(401 ).json({message: "Contraseña incorrecta"});

            }            
        }else{
            res.status(404).json({ error: 'Usuario no encontrado' });
        } 
    }catch(error){
        res.status(500).json({ error: 'Error interno del servidor' });

    }

}

const getUser = async(req, res)=>{
    try {
        const user = res.locals;
        const userBD = await User.findOne({ attributes: { exclude: ['password'] },where: { id: user.id } });
        
        if(userBD) return res.status(200).json(userBD);

        res.status(404).json({ error: 'Usuario no encontrado' });


    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor'+ error.message });

    }
}

const getCollaborador = async(req, res)=>{
    try {
        const email = req.params.email;
        let query = "SELECT name, lastname ,email  FROM users WHERE email = ?";
      const results= await new Promise((resolve, reject) => {
            connection.query(query, [email], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        if(results.length>0){
            return res.status(200).json({message:"Se encontró al usuario"});
        }else{
            return res.status(401).json({message:"No se encontró al usuario"});            
        }
    } catch (error) {
        return res.status(401).json(error);
    }
}

const updateUser = async (req ,res)=>{

    try {
        const user = res.locals
        const {name, lastname, email} = req.body;

        const userBD = await User.findOne({ attributes: { exclude: ['password'] },where: { id: user.id } });

        if(userBD){
            await userBD.update({
                name:name,
                lastname:lastname,
                email:email
            })
         return res.status(200).json({message:"user updated successfully."})

        }else{
            res.status(404).json({ error: 'Usuario no encontrado' });
        }

    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor'+ error.message });

    }
}


module.exports = { registerUser, loginUser, getUser, updateUser,getCollaborador};