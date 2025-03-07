const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    text: { type: String }, 
    rating: { type: String }, 
    userId:{type: mongoose.Schema.Types.ObjectId,ref: "agric"},
    productId:{type: mongoose.Schema.Types.ObjectId,ref: "Product"},
    orderId:{type: mongoose.Schema.Types.ObjectId,ref: "Order"},
}, { timestamps: true });


let FeedbackSchema=mongoose.model("feedback",schema);
module.exports =  FeedbackSchema;
