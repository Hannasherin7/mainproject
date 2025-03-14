const Order = require("../models/buy");
const Product = require("../models/Product");
const Feedback = require("../models/feedback");

// GET /seller/stats
const sellerstats = async (req, res) => {
  const { userId } = req.query;

  try {
    // Fetch orders and populate product details
    const orders = await Order.find({}).populate("productId");

    // Debugging: Log orders with null productId
    const ordersWithNullProduct = orders.filter((order) => !order.productId);
    if (ordersWithNullProduct.length > 0) {
      console.warn("Orders with null productId:", ordersWithNullProduct);
    }

    // Calculate total sales (skip orders with null productId)
    const totalSales = orders
      .filter((order) => order.productId) // Filter out orders with null productId
      .reduce((sum, order) => sum + order.productId.price * order.orderQuantity, 0);

    // Count pending orders (skip orders with null productId)
    const pendingOrders = orders
      .filter((order) => order.productId && order.status === "Order placed")
      .length;

    // Fetch feedbacks and populate product details
    const feedbacks = await Feedback.find({}).populate("productId");

    // Debugging: Log feedbacks with null productId
    const feedbacksWithNullProduct = feedbacks.filter((feedback) => !feedback.productId);
    if (feedbacksWithNullProduct.length > 0) {
      console.warn("Feedbacks with null productId:", feedbacksWithNullProduct);
    }

    // Calculate average rating (skip feedbacks with null productId)
    const validFeedbacks = feedbacks.filter((feedback) => feedback.productId);
    const averageRating =
      validFeedbacks.reduce((sum, feedback) => sum + parseFloat(feedback.rating), 0) /
        validFeedbacks.length || 0;

    res.json({ totalSales, pendingOrders, averageRating });
  } catch (err) {
    console.error("Error in sellerstats:", err);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
};

// GET /seller/activities
const selleractivities = async (req, res) => {
  const { userId } = req.query;

  try {
    const orders = await Order.find({}).populate("productId").sort({ createdAt: -1 }).limit(5);
    const feedbacks = await Feedback.find({}).populate("productId").sort({ createdAt: -1 }).limit(5);

    // Debugging: Log orders and feedbacks with null productId
    const ordersWithNullProduct = orders.filter((order) => !order.productId);
    const feedbacksWithNullProduct = feedbacks.filter((feedback) => !feedback.productId);
    if (ordersWithNullProduct.length > 0 || feedbacksWithNullProduct.length > 0) {
      console.warn("Orders with null productId:", ordersWithNullProduct);
      console.warn("Feedbacks with null productId:", feedbacksWithNullProduct);
    }

    // Format activities (skip orders and feedbacks with null productId)
    const activities = [
      ...orders
        .filter((order) => order.productId)
        .map((order) => ({
          message: `New order received for ${order.productId.pname}`,
          timestamp: order.createdAt,
        })),
      ...feedbacks
        .filter((feedback) => feedback.productId)
        .map((feedback) => ({
          message: `New review received: ${feedback.rating} stars for the product ${feedback.productId.pname}`,
          timestamp: feedback.createdAt,
        })),
    ];

    res.json(activities.sort((a, b) => b.timestamp - a.timestamp).slice(0, 5));
  } catch (err) {
    console.error("Error in selleractivities:", err);
    res.status(500).json({ error: "Failed to fetch activities" });
  }
};

module.exports = {
  sellerstats,
  selleractivities,
};