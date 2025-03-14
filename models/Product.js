const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    pname: { type: String, required: true },
    discription: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    category: { type: String },
    details: { type: String, required: true },
    image: { type: String },
    feedbacks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'feedback' }],
    complaints: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Complaintbuyer' }],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'agric' },
    specialOffers: { type: String, default: "" },
    discountPercentage: { type: Number, default: 0 },
    productype: { type: String, required: true },
    seedcategory: { type: String },
    fertilizercategory: { type: String },
    deliveryZones: [{ type: String }] // Array of supported postal codes
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;