require('../config/db')
const { generateHashedpswd } = require("../helper/index")
const agrimodel = require('../models/agri')

const signup = async () => {
    try {
        let input = {
            "name": "admin",
            "phone": "1122334455",
            "email": "admin@gmail.com",
            "password": "admin",
            isAdmin: true

        }
        let hashedpswd = await generateHashedpswd(input.password);
        input.password = hashedpswd; 

        let agri = new agrimodel(input);
        await agri.save();
        console.log('data uploaded')
    } catch (error) {
        console.error("Error during signup", error);
    }
}


signup()