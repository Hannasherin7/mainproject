const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
  text: { type: String, required: true },
  image: { type: String }, // Path to the uploaded image
  comments: [
    {
      text: { type: String, required: true },
      sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "agric", required: true }, // Reference to the seller
      likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "agric" }], // Array of seller IDs who liked the comment
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Announcement = mongoose.model("Announcement", announcementSchema);

module.exports = Announcement;