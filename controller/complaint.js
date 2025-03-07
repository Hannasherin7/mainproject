
const complaintmodel = require('../models/complaint');
const agrimodel=require('../models/agri')
const mongoose = require("mongoose");

const complaints = async (req, res) => {
    try {
        let input = req.body;
        // Convert to ObjectId before saving
        input.userid = mongoose.Types.ObjectId(req.user.id);
        let newComplaint = new complaintmodel(input); 
        await newComplaint.save(); 
        console.log(newComplaint);
        res.json({ status: "success", data: newComplaint });
    } catch (error) {
        console.error("Error saving complaint:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
};

const complaintList = async (req, res) => {
    try {
        const data = await complaintmodel.find().populate('userid','Name' ).exec();
        console.log(data);
        res.json(data);
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};


const ownComplaint = async (req, res) => {
    try {
        console.log("User ID from token:", req.user.id);

        // Convert the string ID to an ObjectId
        const userId = new mongoose.Types.ObjectId(req.user.id);

        const complaints = await complaintmodel.find({ 
            userid: userId
        });

        console.log("Complaints Found:", complaints); 

        res.status(200).json({ 
            status: "success",  
            complaints 
        });
    } catch (error) {
        console.error("Error fetching user complaints:", error);
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
};
const updateComplaintStatus = async (req, res) => {
    const { _id, status } = req.body;
    try {
      await complaintmodel.findByIdAndUpdate(_id, { status });
      res.json({ status: "success", message: "Complaint status updated successfully" });
    } catch (error) {
      res.json({ status: "error", message: "Failed to update status" });
    }
  }

const deleteComplaint = async (req, res) => {
    try {
        let input = req.body;
        await complaintmodel.findByIdAndDelete(input._id);
        res.json({ status: "success" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

module.exports = { complaints, complaintList, deleteComplaint,ownComplaint,updateComplaintStatus };

