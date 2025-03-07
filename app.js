const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const bcrypt = require("bcryptjs"); // Import encryption package
const jwt = require("jsonwebtoken"); // Importing token library
const indexRouter = require('./routes/index')
require('./config/db')


app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'))





// Connect to MongoDB




app.use('/',indexRouter)




app.listen(7000,()=>{
    console.log("server started",7000)
})