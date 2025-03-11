const express = require("express");

const Announcement = require("../models/Announcement");


const sendannouncement = async (req, res) => {
    try {
      console.log(req.files); // Log uploaded files for debugging
  
      let input = req.body; // Get the request body
  
      // Add image paths to the input object
      req.files?.forEach((item) => {
        input.image = `uploads/${item?.filename}`; // Store the image path
      });
  
      console.log(input); // Log the input object for debugging
  
      // Validate required fields
      if (!input.text || !input.image) {
        return res.status(400).json({ status: "error", message: "All fields are required" });
      }
  
      // Create a new announcement
      let newAnnouncement = new Announcement(input);
      await newAnnouncement.save(); // Save the announcement to the database
  
      res.status(201).json({ status: "success", data: newAnnouncement }); // Send success response
    } catch (error) {
      console.error("Error sending announcement:", error); // Log the error
      res.status(500).json({ status: "error", message: error.message }); // Send error response
    }
  };
  

const announcements= async (req, res) => {
  try {
    const announcements = await Announcement.find().populate("comments.sellerId", "name email").sort({ createdAt: -1 });
    res.status(200).json(announcements);
  } catch (error) {
    console.error("Error fetching announcements:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const comment= async (req, res) => {
  try {
    const { text, sellerId } = req.body;
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    announcement.comments.push({ text, sellerId });
    await announcement.save();
    res.status(201).json({ message: "Comment added successfully", announcement });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Like a Comment
const like = async (req, res) => {
  try {
    const { sellerId } = req.body;
    const announcement = await Announcement.findById(req.params.announcementId);

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    const comment = announcement.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if the seller already liked the comment
    if (!comment.likes.includes(sellerId)) {
      comment.likes.push(sellerId);
      await announcement.save();
    }

    res.status(200).json({ message: "Comment liked successfully", comment });
  } catch (error) {
    console.error("Error liking comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
    sendannouncement,
    announcements,
    comment,
    like
    

    
}
