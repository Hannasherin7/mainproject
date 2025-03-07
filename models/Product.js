const mongoose = require('mongoose');



const ProductSchema = new mongoose.Schema({
    pname: { type: String, required: true },
    discription: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    category: { type: String, required: true },
    details: { type: String, required: true },
    image: { type: String },
    feedbacks: [{type: mongoose.Schema.Types.ObjectId, ref: 'feedback'}], 
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'agric' }, 
});


const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
