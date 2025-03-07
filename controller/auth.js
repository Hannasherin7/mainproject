const { generateHashedpswd, isMatch, generatetoken } = require('../helper/index')
const usermodel = require('../models/agri')

const signup = async (req, res) => {
    try {
        let input = req.body;
        let hashedpswd = await generateHashedpswd(input.password);
        input.password = hashedpswd; 

        let user = new usermodel(input);
        await user.save();
        res.json({ "status": "SIGNUP" });
    } catch (error) {
        console.error("Error during signup", error);
        res.status(500).json({ "status": "error", "message": "Internal Server Error" });
    }
}


const login = async (req, res) => {
    const { email, password } = req.body;
    console.log("Received login request:", { email, password }); 

    try {
        const user = await usermodel.findOne({ email });
        console.log("User found in DB:", user); 

        if (!user) {
            console.log("User not found");
            return res.status(200).json({ status: "Error", message: "User not found" });
        }
        const passwordError = await isMatch(password, user.password);
        console.log("Password check result:", passwordError); 
        if (passwordError) {
            console.log("Incorrect password");
            return res.status(200).json(passwordError); 
        }

        const token = generatetoken({ email, id: user?._id, isAdmin: user?.isAdmin })
        res.json({ status: "Success", userid: user._id, token, name: user?.name,email: user?.email, isAdmin: user?.isAdmin || "false" });
    } catch (error) {
        console.error("Sign-in error:", error);
        res.status(500).json({ status: "Error", message: "An error occurred. Please try again." });
    }
};



module.exports = {
    login,
    signup,
   
}

