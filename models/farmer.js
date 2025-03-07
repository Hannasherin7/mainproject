const mongoose = require("mongoose");

const FarmerSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    idProof: { type: String, required: true }, 
    termsAccepted: { type: Boolean, required: true },
    category: [{ type: String, required: true }],
    status:{type:String,require:true,default:"pending"},
    
    user:{type: mongoose.Schema.Types.ObjectId,ref: "agric"},
}, { timestamps: true });

FarmerSchema.index({ email: 1 }); 

module.exports = mongoose.model("Farmer", FarmerSchema);
