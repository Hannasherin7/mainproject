const Order = require("../models/buy");
const Product = require("../models/Product");
const User=require("../models/agri")



const order = async (req, res) => {
    try {
        const { productId, name, address,pincode, paymentMethod, email, phone, orderQuantity } = req.body; // Include 'name'

        const product = await Product.findById(productId);
        if (!product) {
            return res.json({ status: "error", message: "Product not found." });
        }

        if (product.quantity < orderQuantity) {
            return res.json({ status: "error", message: "Product out of stock or insufficient quantity." });
        }

        // Reduce stock quantity
        product.quantity -= orderQuantity;
        await product.save();

        const orderData = {
            name,  // Add customer name
            productId: product._id,
            address,
            pincode,
            paymentMethod,
            email,
            phone,
            orderQuantity,
            userId: req.user?._id || req.user?.id  // Ensure proper handling of user ID
        };

        console.log(orderData, "Order Data");

        const newOrder = new Order(orderData);
        await newOrder.save();
        res.json({ status: "success", message: "Order placed successfully!" });
    } catch (error) {
        console.error("Order error:", error);
        res.status(500).json({ status: "error", message: "Failed to save order" });
    }
};

const viewpro = async (req, res) => {
    Product.find()
        .then((products) => res.json(products))
        .catch((error) => res.json(error));
}

const soldproduct = async (req, res) => {
    try {
      const userId = req.query.userId; // Get userId from request query
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }
  
      // Find products where userId matches the seller's ID
      const products = await Product.find({ userId: userId })
        .populate({
          path: "feedbacks",
          populate: {
            path: "userId",
          },
        })
        .populate({
          path: "complaints",
          populate: {
            path: "userId",
          },
        })
        .exec();
  
      if (products.length === 0) {
        return res.status(404).json({ error: "No sold products found for this user." });
      }
  
      res.json(products);
    } catch (error) {
      console.error("Error fetching sold products:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };


const recievedorders = async (req, res) => {
    console.log("Fetching received orders for seller...");

    const sellerId = req.query.userId; // Seller's userId

    if (!sellerId) {
        return res.status(400).json({ message: "Seller ID is required" });
    }

    try {
        // Find orders and populate product details
        const orders = await Order.find({})
            .populate('productId') // Get product details
            .exec();

        // Filter orders where the product's sellerId matches the logged-in seller's ID
        const filteredOrders = orders.filter(order => order.productId && order.productId.userId.toString() === sellerId);

        if (filteredOrders.length === 0) {
            return res.status(404).json({ message: "No orders found for this seller" });
        }

        // Format the order details
        const orderDetails = filteredOrders.map(order => ({
            orderId: order._id,
            productName: order.productId.pname,
            productId: order.productId._id,
            userName: order.name,
            userEmail: order.email,
            userPhone: order.phone,
            address: order.address,
            pincode: order.pincode,
            quantity: order.orderQuantity,
            price: order.productId.price,
            status: order.status
        }));

        console.log("Filtered Order Details for seller:", sellerId, orderDetails);
        res.json(orderDetails);
    } catch (error) {
        console.error("Error fetching received orders:", error);
        res.status(500).json({ message: "Error fetching received orders", error });
    }
};

module.exports = { recievedorders };

//View all orders route---------------------------------------------------------------------------
const vieworders = async (req, res) => {
    Order.find()
        .populate('productId') // Populate product details
        .then((orders) => {
            // Return the orders with product details
            const orderDetails = orders.map(order => ({
                orderId: order._id,
                productName: order.productId.pname, // Fetch product name
                productId: order.productId._id, // Fetch product ID
                userName: order.name, // Include user name
                userEmail: order.email,
                userPhone: order.phone,
                address: order.address,
                pincode: order.pincode, // Include pincode
                quantity: order.orderQuantity,
                price: order.productId.price // Fetch product price
            }));

            // Log the order details to console
            console.log("Fetched Order Details: ", orderDetails);

            // Send the order details as a response
            res.json(orderDetails);
        })
        .catch((error) => {
            console.error("Error fetching orders:", error);
            res.status(500).json({ message: "Error fetching orders", error });
        });
}
const viewallorders = async (req, res) => {
    Order.find()
        .populate({ path: 'productId', select: 'pname description price image' }) 
        .exec()
        .then((orders) => {
            const orderDetails = orders
                .filter(order => order.productId) // Filter out null productId
                .map(order => ({
                    orderId: order._id,
                    productId: order.productId._id, // Fetch product ID safely
                    productName: order.productId.pname || "Product Not Found", // Handle missing name
                    userName: order.name,
                    userEmail: order.email,
                    userPhone: order.phone,
                    address: order.address,
                    pincode: order.pincode,
                    quantity: order.orderQuantity,
                    price: order.productId.price || 0 // Handle missing price
                }));

            console.log("Fetched Order Details: ", orderDetails);
            res.json(orderDetails);
        })
        .catch((error) => {
            console.error("Error fetching orders:", error);
            res.status(500).json({ message: "Error fetching orders", error });
        });
};


// const ownorders = async (req, res) => {
//     try {
//         const { userId } = req.query; // Get userId from request query params

//         if (!userId) {
//             return res.status(400).json({ message: "User ID is required" });
//         }

//         const orders = await Order.find({ userId, productId: { $ne: null } }) 
//     .populate('productId');


//         const orderDetails = orders.map(order => ({
//             productName: order.productId.pname,
//             userName: order.name,
//             userPhone: order.phone,
//             address: order.address,
//             discription: order.productId.discription,
//             quantity: order.orderQuantity,
//             paymentMethod:order.paymentMethod,
//             price: order.productId.price,
//             status: order.status,
//             image:order.productId.image
//         }));

//         console.log("Fetched Order Details: ", orderDetails);
//         res.json(orderDetails);
//     } catch (error) {
//         console.error("Error fetching orders:", error);
//         res.status(500).json({ message: "Error fetching orders", error });
//     }
// };


const ownorders = async (req, res) => {
    try {
      const { userId } = req.query;
  
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
  
      const orders = await Order.find({ userId })
        .populate({
          path: 'productId',
          select: 'pname discription price image feedbacks',
          populate: {
            path: 'feedbacks',
            model: 'feedback',
          },
        })
        .exec();
  
      if (!orders.length) {
        return res.status(404).json({ message: "No orders found for this user." });
      }
  
      const orderDetails = orders.map((order) => {
        if (!order.productId) {
          console.warn(`Order with ID ${order._id} has a missing product reference.`);
          return null; // Skip if productId is null
        }
  
        return {
          productName: order.productId.pname,
          productId: order.productId._id,
          userName: order.name,
          userPhone: order.phone,
          address: order.address,
          discription: order.productId.discription,
          quantity: order.orderQuantity,
          paymentMethod: order.paymentMethod,
          price: order.productId.price,
          status: order.status,
          image: order.productId.image,
          feedbacks: order.productId.feedbacks || [], // Ensure feedbacks is always an array
        };
      }).filter(order => order !== null); // Remove null values
  
      console.log("Fetched Order Details:", orderDetails);
      res.json(orderDetails);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Error fetching orders", error });
    }
  };
const viewORD13123 = async (req, res) => {
    console.log(req.query.email)
    const userEmail = req.query.email; // Get email from query parameters
    console.log("User email: ", userEmail);
    // Step 1: Find products associated with the user email
    Product.find({ email: userEmail })
        .then(products => {
            // If no products found, send an error response
            if (products.length === 0) {
                return res.status(404).json({ message: "No products found for this user." });
            }


            // Get the product IDs for the found products
            const productIds = products.map(product => product._id);
            console.log("Found product IDs: ", productIds);

            // Step 2: Find orders associated with these product IDs
            return Order.find({ productId: { $in: productIds } }).populate('productId');
        })
        .then(orders => {
            // If no orders found, send a message
            if (orders.length === 0) {
                return res.status(404).json({ message: "No orders found for the user's products." });
            }

            // Step 3: Format the order details
            const orderDetails = orders.map(order => ({
                orderId: order._id,
                productName: order.productId.pname, // Fetch product name from populated product
                productId: order.productId._id, // Fetch product ID
                userName: order.name, // Customer name
                userEmail: order.email, // Customer email
                userPhone: order.phone, // Customer phone
                address: order.address, // Customer address
                pincode: order.pincode, // Customer pincode
                quantity: order.orderQuantity, // Order quantity
                price: order.productId.price // Product price from populated product
            }));

            console.log("Order Details: ", orderDetails);
            res.json(orderDetails); // Send the order details as response
        })
        .catch(error => {
            console.error("Error fetching orders: ", error);
            res.status(500).json({ message: "Error fetching orders", error });
        });
}
// Fetch orders by user email
const ordersemail = async (req, res) => {
    const userEmail = req.params.email;

    try {
        const orders = await Order.find({ email: userEmail }); // Adjust your query based on your Order schema
        if (orders.length === 0) {
            return res.status(404).json({ status: "Error", message: "No orders found for this user." });
        }
        res.status(200).json({ status: "Success", orders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ status: "Error", message: "An error occurred while fetching orders." });
    }
}


const mongoose = require("mongoose");
const updateOrderStatus = async (req, res) => {
    const { orderId, status } = req.body;  

    try {
        
        const objectId = new mongoose.Types.ObjectId(orderId);

        const updatedOrder = await Order.findOneAndUpdate(
            { _id: objectId },  
            { status },
            { new: true } 
        );

        if (!updatedOrder) {
            return res.json({ status: "error", message: "Order not found" });
        }

        res.json({ status: "success", message: "Order status updated successfully", order: updatedOrder });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ status: "error", message: "Failed to update status" });
    }
};



module.exports = {
    order,
    recievedorders,
    vieworders,
    viewpro,
    ordersemail,
    soldproduct,
    ownorders,
    updateOrderStatus,
    viewallorders
    
}
