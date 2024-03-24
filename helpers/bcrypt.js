const bcrypt = require('bcryptjs')

const encrypt = async (textPlain)=>{
    const hash = await bcrypt.hash(textPlain,10);
    return hash;
}

const compare = async (passwordPlain, hashPasword)=>{
    return await bcrypt.compare(passwordPlain, hashPasword);
}

module.exports= { encrypt, compare}