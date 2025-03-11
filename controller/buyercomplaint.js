const Complaint = require("../models/buyercomplaint");
const Order = require("../models/buy");
const Product = require("../models/Product");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types; // Correct way to import ObjectId

// Submit Complaint
const submitComplaint = async (req, res) => {
  const { description, category, resolutionRequest, userId, productId } = req.body;

  try {
    // Check if the user has already submitted a complaint for this product
    const existingComplaint = await Complaint.findOne({ userId, productId });
    if (existingComplaint) {
      return res.status(400).json({ message: "You have already submitted a complaint for this product." });
    }

    // Validate required fields
    if (!description || !category || !resolutionRequest) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    // Handle image upload
    let evidence = null;
    if (req.files && req.files.length > 0) {
      evidence = `uploads/${req.files[0].filename}`;
    }

    // Create new complaint
    const newComplaint = new Complaint({
      description,
      category,
      resolutionRequest,
      evidence,
      userId,
      productId,
    });

    // Save the complaint
    const savedComplaint = await newComplaint.save();

    // Update the product with the new complaint
    await Product.findByIdAndUpdate(productId, {
      $push: { complaints: savedComplaint._id },
    });

    res.status(201).json({ message: "Complaint submitted successfully", complaint: savedComplaint });
  } catch (error) {
    console.error("Error submitting complaint:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Get User Complaints
const getUserComplaints = async (req, res) => {
  const userId = req.user.id;

  try {
    const complaints = await Complaint.find({ userId }).populate("productId"); // Remove the extra space
    res.status(200).json({ complaints });
  } catch (error) {
    console.error("Error fetching user complaints:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get All Complaints (for admin)
const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate({
        path: "userId",
        select: "name email", // Populate user details (buyer)
      })
      .populate({
        path: "productId",
        select: "pname image userId", // Populate product details
        populate: {
          path: "userId", // Corrected field name (seller)
          select: "name email", // Populate seller details
        },
      });

    res.status(200).json({ complaints });
  } catch (error) {
    console.error("Error fetching all complaints:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Seller Responds to a Complaint
const sellerRespondToComplaint = async (req, res) => {
  const { complaintId } = req.params;
  const { sellerResponse } = req.body;

  try {
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      complaintId,
      { sellerResponse },
      { new: true }
    );

    if (!updatedComplaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.status(200).json({ message: "Seller response submitted successfully", complaint: updatedComplaint });
  } catch (error) {
    console.error("Error submitting seller response:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update Complaint
const updateComplaint = async (req, res) => {
  const { complaintId, description, category, resolutionRequest } = req.body;

  try {
      const updatedComplaint = await Complaint.findByIdAndUpdate(
          complaintId,
          { description, category, resolutionRequest },
          { new: true }
      );

      if (!updatedComplaint) {
          return res.status(404).json({ message: "Complaint not found" });
      }

      res.status(200).json({ message: "Complaint updated successfully", complaint: updatedComplaint });
  } catch (error) {
      console.error("Error updating complaint:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};
// Update Complaint Status
const updateComplaintStatus = async (req, res) => {
  const { complaintId } = req.params;
  const { status, sellerMessage } = req.body;

  try {
    // Find the complaint by ID
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    // Update the complaint status and seller message
    complaint.status = status || complaint.status;
    complaint.sellerResponse = sellerMessage || complaint.sellerResponse;
    await complaint.save();

    res.status(200).json({ message: "Complaint updated successfully", complaint });
  } catch (error) {
    console.error("Error updating complaint:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const checkExistingComplaint = async (userId, productId) => {
  console.log("Received productId:", productId);
  console.log("Type of productId:", typeof productId);

  if (!productId) {
    console.error("productId is missing or undefined");
    throw new Error("productId is required");
  }

  if (typeof productId !== "string") {
    console.error("productId is not a string:", productId);
    throw new Error("productId must be a string");
  }

  const sanitizedProductId = productId.trim();
  console.log("Sanitized productId:", sanitizedProductId);

  if (!mongoose.Types.ObjectId.isValid(sanitizedProductId)) {
    console.error("Invalid productId:", sanitizedProductId);
    throw new Error("Invalid productId");
  }

  const productObjectId = new mongoose.Types.ObjectId(sanitizedProductId);
  const existingComplaint = await Complaint.findOne({ userId, productId: productObjectId });
  return existingComplaint !== null;
};


module.exports = {
  submitComplaint,
  getUserComplaints,
  getAllComplaints,
  sellerRespondToComplaint,
  updateComplaint,
  updateComplaintStatus,
  checkExistingComplaint
};