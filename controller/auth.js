const { generateHashedpswd,isMatch, generatetoken } = require('../helper/index')
const agrimodel = require('../models/agri')



const signup = async (req, res) => {
    try {
        let input = req.body;
        let hashedpswd = await generateHashedpswd(input.password);
        input.password = hashedpswd; // This is for getting hashed password in db

        let agriusers = new agrimodel(input);
        await agriusers.save();
        res.json({ "status": "SIGNUP" });
    } catch (error) {
        console.error("Error during signup", error);
        res.status(500).json({ "status": "error", "message": "Internal Server Error" });
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;
    console.log("Received login request:", { email, password }); // Log input data

    try {
        const agri = await agrimodel.findOne({ email });
        console.log("User found in DB:", agri); // Log user data

        if (!agri) {
            console.log("User not found");
            return res.status(404).json({ status: "Error", message: "User not found" });
        }

        
        const passwordError = await isMatch(password, agri.password);
        console.log("Password check result:", passwordError); // Debug password check

        if (passwordError) {
            console.log("Incorrect password");
            return res.status(401).json(passwordError); // Send incorrect password error
        }


        const token = generatetoken(email)
        console.log("Generated token:", token); // Debug token generation
        res.json({ status: "Success", userid: agri._id, token });
    } catch (error) {
        console.error("Sign-in error:", error);
        res.status(500).json({ status: "Error", message: "An error occurred. Please try again." });
    }
};





module.exports = {
    signup,
    login
}