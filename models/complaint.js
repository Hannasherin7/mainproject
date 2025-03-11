const mongoose = require("mongoose");

const schema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    complaint: { type: String, required: true },
    image: {
        type: String
      },
    resolutionRequest: { 
        type: String, 
        required: true,
        enum: ["Immediate Investigation", "Refund/Compensation", "Account Reinstatement", "Listing Correction", "Technical Support"]
    },
    dateFiled: { type: Date, default: Date.now },
    adminMessage: { type: String, default: "" },
    status: { type: String, default: "pending" },
    userid: { type: mongoose.Schema.Types.ObjectId, ref: "agric" }
});

const ComplaintModel = mongoose.model("Complaint", schema);

module.exports = ComplaintModel;