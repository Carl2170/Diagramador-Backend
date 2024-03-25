const {encrypt, compare} = require('../helpers/bcrypt');
const connection = require('../connection');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const registerUser = async (req, res) => {
    try {
        let user = req.body;
        let passwordHash;
        let query = "SELECT email, password, status FROM users WHERE email = ?";
        const results = await new Promise((resolve, reject) => {
            connection.query(query, [user.email], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        if (results.length <= 0) {
            query = "INSERT INTO users(name, lastname, email, password, status) VALUES (?, ?, ?, ?, 'false')";
            passwordHash=await encrypt(user.password);
            await new Promise((resolve, reject) => {
                connection.query(query, [user.name, user.lastname, user.email, passwordHash], (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                });
            });
            return res.status(200).json({ message: "Successfully registered" });
        } else {
            return res.status(400).json({ message: "Email already exists" });
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};

const loginUser = async(req, res)=>{
    try {
        let user = req.body;
        query="SELECT * FROM users where email = ?";

        const results = await new Promise((resolve, reject) => {
            connection.query(query, [user.email], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
     
        if (results.length <= 0 ) {
            return res.status(404).json({message:"user not found"}) 
        }else{
            const checkPassword = await compare(user.password, results[0].password);
            if(checkPassword){
                const response = { 
                     id:results[0].id,
                    name:results[0].name,
                    lastname:results[0].lastname,
                    email:results[0].email,
                    };
            const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN,{
                expiresIn:"8h",
            });
            return res.status(200).json({token:accessToken, name:results[0].name});
            }else{
            return res.status(401).json({message:"Incorrect username o password"}) 
            }
        }

    } catch (error) {
        console.log("error");
        return res.status(500).json(error);

    }

}

const getUser = async(req, res)=>{
    try {
        let user = res.locals;
        let query = "SELECT name, lastname ,email  FROM users WHERE id = ?";
      const results= await new Promise((resolve, reject) => {
            connection.query(query, [user.id], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        return res.status(200).json(results);
    } catch (error) {
        return res.status(401).json(error);
    }
}

const updateUser = async (req ,res)=>{
    try {
        let uId = res.locals;
        let user= req.body;
        var query = "UPDATE users SET name=?, lastname=?, email=? WHERE id=?";
        await new Promise((resolve, reject) => {
            connection.query(query, [user.name, user.lastname, user.email, uId.id], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        return res.status(200).json({message:"user updated successfully."})
    } catch (error) {
        return res.status(500).json(err);
    }
}


module.exports = { registerUser, loginUser, getUser, updateUser};