const Order = require("../models/buy");
const Product = require("../models/Product");
const Feedback = require("../models/feedback")



// GET /seller/stats
const sellerstats = async (req, res) => {
    const { userId } = req.query;
  
    try {
      // Calculate total sales
      const orders = await Order.find({  }).populate("productId");
      const totalSales = orders.reduce((sum, order) => sum + (order.productId.price * order.orderQuantity), 0);
  
      // Count pending orders
      const pendingOrders = orders.filter(order => order.status === "Order placed").length;
  
      // Calculate average rating
      const feedbacks = await Feedback.find({  }).populate("productId");
      const averageRating = feedbacks.reduce((sum, feedback) => sum + parseFloat(feedback.rating), 0) / feedbacks.length || 0;
  
      res.json({ totalSales, pendingOrders, averageRating });
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch statistics" });
    }
  };


  // GET /seller/activities
const selleractivities = async (req, res) => {
    const { userId } = req.query;
  
    try {
      const orders = await Order.find({  }).populate("productId").sort({ createdAt: -1 }).limit(5);
      const feedbacks = await Feedback.find({  }).populate("productId").sort({ createdAt: -1 }).limit(5);
  
      const activities = [
        ...orders.map(order => ({
          message: `New order received for ${order.productId.pname}`,
          timestamp: order.createdAt,
        })),
        ...feedbacks.map(feedback => ({
          message: `New review received: ${feedback.rating} stars for the product ${feedback.productId.pname}`,
          timestamp: feedback.createdAt,
        })),
      ];
  
      res.json(activities.sort((a, b) => b.timestamp - a.timestamp).slice(0, 5));
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch activities" });
    }
  };


  module.exports = {
    sellerstats,
    selleractivities,
  }
  