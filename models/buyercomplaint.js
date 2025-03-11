const mongoose = require("mongoose");

const buyercomplaintSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "agric", required: true }, // User who submitted the complaint
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, // Product being complained about
  
    description: { type: String, required: true }, // Detailed explanation of the issue
    category: { 
        type: String, 
        required: true, 
        enum: ["Damaged Product", "Late Delivery", "Wrong Product", "Poor Quality", "Missing Items", "Others"] 
    }, // Complaint category
    resolutionRequest: {
        type: String,
        required: true,
        enum: ["Replacement", "Refund", "Return", "Exchange", "Other"], 
    },
    evidence: { type: String }, 
    date: { type: Date, default: Date.now }, 
    sellerResponse: { type: String, default: "" }, // Seller's response
    status: { 
        type: String, 
        default: "Pending", 
        enum: ["Pending", "In Progress", "Resolved", "Rejected"] 
    }, // Complaint status
}, { timestamps: true });

module.exports = mongoose.model("Complaintbuyer", buyercomplaintSchema);