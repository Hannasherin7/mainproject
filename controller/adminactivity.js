const Order = require("../models/buy");
const Product = require("../models/Product");
const Feedback = require("../models/feedback");
const User = require("../models/agri"); // Assuming you have a User model

// GET /admin/activities
const adminActivities = async (req, res) => {
  try {
    // Fetch recent orders with buyer, seller, and product details
    const orders = await Order.find({})
      .populate({
        path: "productId",
        populate: {
          path: "userId", // Populate the seller's details from the Product model
          select: "name email", // Select only the name and email of the seller
        },
      })
      .populate("userId", "name email") // Populate the buyer's details
      .sort({ createdAt: -1 })
      .limit(5);

    // Fetch recent reviews with buyer, seller, and product details
    const feedbacks = await Feedback.find({})
      .populate({
        path: "productId",
        populate: {
          path: "userId", // Populate the seller's details from the Product model
          select: "name email", // Select only the name and email of the seller
        },
      })
      .populate("userId", "name email") // Populate the reviewer's details
      .sort({ createdAt: -1 })
      .limit(5);

    // Format activities
    const activities = [
      ...orders
        .filter((order) => order.productId) // Filter out orders with null productId
        .map((order) => ({
          type: "order",
          message: `New order placed by ${order.userId.name} (${order.userId.email}) for ${order.productId.pname}`,
          timestamp: order.createdAt,
          details: {
            buyer: order.userId.name,
            seller: order.productId.userId.name, // Seller's name from the Product model
            product: order.productId.pname,
            quantity: order.orderQuantity,
            totalAmount: order.productId.price * order.orderQuantity,
          },
        })),
      ...feedbacks
        .filter((feedback) => feedback.productId) // Filter out feedbacks with null productId
        .map((feedback) => ({
          type: "review",
          message: `New review by ${feedback.userId.name} (${feedback.userId.email}): ${feedback.rating} stars for ${feedback.productId.pname}`,
          timestamp: feedback.createdAt,
          details: {
            reviewer: feedback.userId.name,
            seller: feedback.productId.userId.name, // Seller's name from the Product model
            product: feedback.productId.pname,
            rating: feedback.rating,
            comment: feedback.comment,
          },
        })),
    ];

    // Sort activities by timestamp
    const sortedActivities = activities.sort((a, b) => b.timestamp - a.timestamp);

    res.json(sortedActivities.slice(0, 5)); // Return top 5 activities
  } catch (err) {
    console.error("Error fetching admin activities:", err);
    res.status(500).json({ error: "Failed to fetch activities" });
  }
};

module.exports = {
  adminActivities,
};