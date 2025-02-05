const orderSchema =require("../models/buy");
const ProductSchema =require("../models/Product");


// Buy product route (handling "Buy Now")
const order = async  (req, res) => {
    const { productId, address, paymentMethod, email, phone, orderQuantity } = req.body;

    // Find the product by ID
    Product.findById(productId)
        .then((product) => {
            if (product && product.quantity >= orderQuantity) {
                // Reduce the product quantity by the ordered amount
                product.quantity -= orderQuantity;

                // Save the updated product quantity
                product.save()
                    .then(() => {
                        // Create a new order with all the details
                        const newOrder = new Order({
                            productId: product._id,
                            address,
                            paymentMethod,
                            email,
                            phone,
                            orderQuantity
                        });

                        // Save the order
                        newOrder.save()
                            .then(() => res.json({ status: "success", message: "Order placed successfully!" }))
                            .catch((error) => res.json({ status: "error", message: error.message }));
                    })
                    .catch((error) => res.json({ status: "error", message: error.message }));
            } else {
                res.json({ status: "error", message: "Product out of stock or insufficient quantity." });
            }
        })
        .catch((error) => res.json({ status: "error", message: error.message }));
}

// Fetch all products
const viewpro = async (req, res) => {
    Product.find()
        .then((products) => res.json(products))
        .catch((error) => res.json(error));
}

const viewORD = async (req, res) => {
    console.log("hiii")
    const sellerEmail = req.query.email; // Retrieve the seller email from query parameters
    
    // Check if the email is provided
    if (!sellerEmail) {
        return res.status(400).json({ message: "Seller email is required" });
    }

    // Fetch orders that match the provided seller email
    Order.find()
        .populate('productId') // Populate product details
        .then((orders) => {
            // Filter orders based on the seller's email
            const filteredOrders = orders.filter(order => 
                order.productId.email && order.productId.email.toLowerCase() === sellerEmail.toLowerCase()
            );

            // Prepare order details to send as a response
            const orderDetails = filteredOrders.map(order => ({
                orderId: order._id,
                productName: order.productId.pname, // Fetch product name
                productId: order.productId._id, // Fetch product ID
                userName: order.name, // Include user name
                userEmail: order.email, // Include user email (customer)
                userPhone: order.phone, // Include user phone
                address: order.address, // Include delivery address
                pincode: order.pincode, // Include pincode
                quantity: order.orderQuantity, // Include quantity
                price: order.productId.price // Fetch product price
            }));

            // Log filtered orders to the console
            console.log("Filtered Order Details for seller:", sellerEmail, orderDetails);

            // Send the filtered orders as a response
            res.json(orderDetails);
        })
        .catch((error) => {
            console.error("Error fetching orders:", error);
            res.status(500).json({ message: "Error fetching orders", error });
        });
}








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
const ordersemail =  async (req, res) => {
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

module.exports = {
    order,
    viewORD,
    viewORD13123,
    vieworders,
    viewpro,
    ordersemail
}
