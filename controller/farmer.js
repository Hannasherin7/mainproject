const FarmerModel = require("../models/farmer");

const mongoose = require("mongoose");


// Register Farmer
const registerFarmer = async (req, res) => {
    try {
        console.log(req.files);

        let input = req.body;

        req.files?.forEach((item) => {
            input.idProof = `/uploads/${item?.filename}`;
        });

        input.user = req.user.id;
        console.log(input);

        if (!input.name || !input.email || !input.phone || !input.category || !input.idProof || !input.termsAccepted) {
            return res.status(400).json({ status: "error", message: "All fields are required" });
        }

        let existingFarmer = await FarmerModel.findOne({ email: input.email });
        if (existingFarmer) {
            if (existingFarmer.status === "rejected") {
                await FarmerModel.deleteOne({ email: input.email });
            } else {
                return res.status(400).json({ status: "error", message: "Farmer already registered" });
            }
        }

        input.status = "pending";
        let newFarmer = new FarmerModel(input);
        await newFarmer.save();

        res.status(201).json({ status: "success", data: newFarmer });
    } catch (error) {
        console.error("Error registering farmer:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
};
// Get All Farmers (For Admin)
// const getAllFarmers = async (req, res) => {
//     try {
//         const farmers = await FarmerModel.find().populate('user','Name' );
//         res.json({ status: "success", data: farmers });
//     } catch (error) {
//         res.status(500).json({ status: "error", message: "Failed to retrieve farmers" });
//     }
// };

const getAllFarmers = async (req, res) => {
    try {
        const farmers = await FarmerModel.find().populate('user', 'Name');
        if (!farmers || farmers.length === 0) {
            return res.status(404).json({ status: "error", message: "No farmers found" });
        }
        res.json({ status: "success", data: farmers });
    } catch (error) {
        console.error("Error fetching farmers:", error);
        res.status(500).json({ status: "error", message: "Failed to retrieve farmers" });
    }
};

const updateFarmerStatus = async (req, res) => {
    const { farmerId, status } = req.body;
    try {
        await FarmerModel.findByIdAndUpdate(farmerId, { status });
        res.json({ status: "success", message: "Farmer status updated successfully" });
    } catch (error) {
        res.json({ status: "error", message: "Failed to update status" });
    }
};




// Check if user is already registered
 
const checkFarmerStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const farmer = await FarmerModel.findOne({ user: userId });
        
        if (farmer) {
            return res.status(200).json({ status: farmer.status });
        } else {
            return res.status(404).json({ status: "not registered" });
        }
    } catch (error) {
        console.error("Error in checkFarmerStatus:", error);
        res.status(500).json({ error: "Server error" });
    }
};


// In your backend (Node.js/Express)
const checkexistence = async (req, res) => {
    try {
        const farmer = await FarmerModel.findOne({ user: req.params.userId });
        if (farmer) {
            res.json({ isRegistered: true, userDetails: farmer });
        } else {
            res.json({ isRegistered: false });
        }
    } catch (error) {
        console.error('Error checking registration:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { registerFarmer, getAllFarmers, updateFarmerStatus, checkFarmerStatus,checkexistence };
