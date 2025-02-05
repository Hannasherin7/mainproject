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

const generatetoken = (email) => jwt.sign({ email }, "task-app", { expiresIn: "1d" });


module.exports = {
    generateHashedpswd,
    isMatch,
    generatetoken
}