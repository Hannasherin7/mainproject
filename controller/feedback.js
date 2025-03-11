const mongoose = require("mongoose");
const Feedback = require("../models/feedback")  // Import the Feedback model
const Product = require("../models/Product");
const Order = require("../models/buy");

const submitfeedback = async (req, res) => {
  const { text, rating, userId, productId, orderId } = req.body;

  try {
    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the user has already submitted feedback for this order
    const existingFeedback = await Feedback.findOne({ userId, productId });
    if (existingFeedback) {
      return res.status(400).json({ message: "Feedback already exists" });
    }


    // Create new feedback
    const newFeedback = new Feedback({
      text,
      rating,
      userId,
      productId,
      orderId,
    });

    // Save the feedback
    const savedFeedback = await newFeedback.save();

    // Update the product with the new feedback
    await Product.findByIdAndUpdate(productId, {
      $push: { feedbacks: savedFeedback._id },
    });

    res.json({ message: "Feedback submitted successfully", feedback: savedFeedback });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



const getUserFeedbacks = async (req, res) => {
  const userId = req.user.id; 

  try {
   
    const feedbacks = await Feedback.find({ userId }).populate("productId");

    res.json({ feedbacks });
  } catch (error) {
    console.error("Error fetching user feedbacks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateFeedback = async (req, res) => {
  const { feedbackId } = req.params; // Get feedbackId from the URL
  const { text, rating } = req.body; // Get updated feedback data from the request body

  try {
    // Find the feedback by ID
    const feedback = await Feedback.findById(feedbackId);

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    // Update the feedback
    feedback.text = text;
    feedback.rating = rating;

    // Save the updated feedback
    const updatedFeedback = await feedback.save();

    res.json({ message: "Feedback updated successfully", feedback: updatedFeedback });
  } catch (error) {
    console.error("Error updating feedback:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};




// Route to check if the user has already submitted feedback for a product
const checkfeedback = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id; // Assuming the user ID is available in the request (from authentication middleware)

  try {
    // Check if feedback already exists for this user and product
    const existingFeedback = await Feedback.findOne({ userId, productId });

    if (existingFeedback) {
      // If feedback exists, return a response indicating that feedback has already been submitted
      return res.status(200).json({ hasSubmittedFeedback: true });
    } else {
      // If no feedback exists, return a response indicating that feedback has not been submitted
      return res.status(200).json({ hasSubmittedFeedback: false });
    }
  } catch (error) {
    console.error("Error checking feedback:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}




const addfeedback = async (req, res) => {
  try {
    const { text, rating, userId, productId, orderId } = req.body;

    // Create and save the feedback
    const feedback = new Feedback({
      text,
      rating,
      userId,
      productId,
      orderId,
    });

    const savedFeedback = await feedback.save();

    // Push the feedback ID into the product's feedbacks array
    await Product.findByIdAndUpdate(productId, {
      $push: { feedbacks: savedFeedback._id },
    });

    res.status(201).json(savedFeedback);
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ message: "Error submitting feedback", error });
  }
}





module.exports = {
  submitfeedback,
  getUserFeedbacks,
  updateFeedback,
  checkfeedback,
  addfeedback
  
}