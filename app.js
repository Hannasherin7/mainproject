const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const bcrypt = require("bcryptjs"); // Import encryption package
const jwt = require("jsonwebtoken"); // Importing token library
const indexRouter = require('./routes/index')

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb+srv://hannasherin:Alazhar4@cluster0.agtcb.mongodb.net/DBAgriConnect?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Failed to connect to MongoDB", err));




app.use('/',indexRouter)




app.listen(7000,()=>{
    console.log("server started",7000)
})