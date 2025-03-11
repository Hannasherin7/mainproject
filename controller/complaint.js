const ComplaintModel = require('../models/complaint');
const mongoose = require("mongoose");

const createComplaint = async (req, res) => {
    try {
        console.log(req.files); 

        let input = req.body;

        
        if (req.files && req.files.length > 0) {
            input.image = `uploads/${req.files[0].filename}`; 
        }

        input.userid = new mongoose.Types.ObjectId(req.user.id); 
        console.log(input); 

        if (!input.name || !input.email || !input.phoneNumber || !input.complaint || !input.resolutionRequest) {
            return res.status(400).json({ status: "error", message: "All fields are required" });
        }

        const newComplaint = new ComplaintModel(input);
        await newComplaint.save();

        res.status(201).json({ status: "success", data: newComplaint });
    } catch (error) {
        console.error("Error creating complaint:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
};
const getComplaints = async (req, res) => {
    try {
        const data = await ComplaintModel.find().populate('userid', 'Name').exec();
        res.json(data);
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

const getOwnComplaints = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);
        const complaints = await ComplaintModel.find({ userid: userId });
        res.status(200).json({ status: "success", complaints });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
};

const updateComplaintStatus = async (req, res) => {
    const { _id, status, adminMessage } = req.body;
    try {
        await ComplaintModel.findByIdAndUpdate(_id, { status, adminMessage });
        res.json({ status: "success", message: "Complaint status updated successfully" });
    } catch (error) {
        res.json({ status: "error", message: "Failed to update status" });
    }
};

const deleteComplaint = async (req, res) => {
    try {
        const { _id } = req.body;
        await ComplaintModel.findByIdAndDelete(_id);
        res.json({ status: "success" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

module.exports = { createComplaint, getComplaints, getOwnComplaints, updateComplaintStatus, deleteComplaint };