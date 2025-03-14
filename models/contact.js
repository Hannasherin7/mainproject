const mongoose = require("mongoose");


const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "agric",
        required: true,
    },
});

const Contact = mongoose.model("Contact", contactSchema);


module.exports = Contact;