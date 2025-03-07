const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const generateHashedpswd = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10); // Salt is a cost factor
        return await bcrypt.hash(password, salt);
    } catch (error) {
        console.error("Error generating hashed password", error);
        throw error;
    }
}

const isMatch = async (password, agriPassword) => {
    const match = await bcrypt.compare(password, agriPassword);
    return match ? null : { status: "Error", message: "Incorrect password" };

};

const generatetoken = (userdata) => jwt.sign(userdata, "task-app", { expiresIn: "1d" });

const verifytoken = async(token) => {
   const decoded = await  jwt.verify(token,"task-app",);
   console.log(decoded)
   return decoded
   
}




module.exports = {
    generateHashedpswd,
    isMatch,
    generatetoken,
    verifytoken
}