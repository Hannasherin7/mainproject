const tipmodel =require("../models/tip");
const mongoose = require("mongoose");

// const addtip = async (req,res)=>{
//     let input=req.body
//     let tip=new tipmodel(input)
//     tip.save()
//     console.log(tip)
//     res.json({"status":"success"})
// }
const addtip = async (req, res) => {
    try {
        console.log("Logged-in user:", req.user); // Debugging user info
        console.log("Uploaded files:", req.files); // Logging uploaded files

        let input = req.body;

        // Ensure user is authenticated
        if (!req.user || !req.user.id) {
            return res.status(401).json({ status: "error", message: "Unauthorized: User ID missing" });
        }

        // Handling file uploads
        if (req.files && req.files.length > 0) {
            input.imaget = `uploads/${req.files[0].filename}`;
        }

        // Adding userId to input
        input.userId = req.user.id;

        // Validation to check required fields
        if (!input.imaget || !input.item || !input.tip) {
            return res.status(400).json({ status: "error", message: "All fields are required" });
        }

        let newTip = new tipmodel(input);
        await newTip.save();

        res.status(201).json({ status: "success", data: newTip });
    } catch (error) {
        console.error("Error adding storage tip:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
};


const searchtip = async (req,res)=>{
    let input=req.body
    tipmodel.find(input).then((data)=>{
        res.json(data)
    }
    ).catch((error)=>{
        res.json(error)
    })
}

const deletetip = async (req,res)=>{
    const { tipId } = req.body;

    // Input validation
    if (!tipId) {
      return res.status(400).json({ status: "error", message: "Tip ID is required" });
    }
  
    try {
      // Check if the tip ID is valid
      if (!mongoose.Types.ObjectId.isValid(tipId)) {
        return res.status(400).json({ status: "error", message: "Invalid Tip ID" });
      }
  
      // Delete the tip
      const result = await tipmodel.deleteOne({ _id: tipId });
  
      // Check if the tip was found and deleted
      if (result.deletedCount === 1) {
        return res.status(200).json({ status: "success", message: "Tip deleted successfully" });
      } else {
        return res.status(404).json({ status: "error", message: "Tip not found" });
      }
    } catch (error) {
      console.error("Error deleting tip:", error);
      return res.status(500).json({ status: "error", message: "Internal server error" });
    }
  }


const viewtips = async (req,res)=>{
    tipmodel.find().then((data)=>{
        res.json(data)
    }).catch((error)=>{
        res.json(error)
    })
}

const getUserTips = async (req, res) => {
    try {
        const userId = req.user.id;
        const tips = await tipmodel.find({ userId });

        res.json({ status: "success", tips });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Server error" });
    }
};


const deletetipbyadmin = async (req, res) => {
    const { id } = req.body;
  
    // Input validation
    if (!id) {
      return res.status(400).json({ status: "error", message: "Tip ID is required" });
    }
  
    try {
      // Check if the ID is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ status: "error", message: "Invalid Tip ID" });
      }
  
      // Delete the tip
      const result = await tipmodel.deleteOne({ _id: id });
  
      // Check if the tip was found and deleted
      if (result.deletedCount === 1) {
        return res.status(200).json({ status: "success", message: "Tip deleted successfully" });
      } else {
        return res.status(404).json({ status: "error", message: "Tip not found" });
      }
    } catch (error) {
      console.error("Error deleting tip:", error);
      return res.status(500).json({ status: "error", message: "Internal server error" });
    }
  }
  

module.exports = {
    addtip,
    deletetip,
    searchtip,
    viewtips,
    getUserTips,
    deletetipbyadmin
}