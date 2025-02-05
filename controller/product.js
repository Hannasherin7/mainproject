const ProductSchema =require("../models/Product");

const addpro = async (req, res) => {
    const input = req.body;
    const product = new Product(input);
    product.save()
        .then(() => {
            console.log("Product added:", product);
            res.json({ "status": "success" });
        })
        .catch((error) => {
            console.log("Error adding product:", error);
            res.json({ "status": "error", "message": error.message });
        });
}

// Search products route
const searchpro = (req, res) => {
    const input = req.body;
    Product.find(input)
        .then((data) => res.json(data))
        .catch((error) => res.json(error));
}

// Delete product route
const deletepro = async (req, res) => {
    const input = req.body;
    Product.findByIdAndDelete(input._id)
        .then(() => res.json({ "status": "success" }))
        .catch((error) => res.json({ "status": "error", "message": error.message }));
}

// View all products route
const viewpro = async (req, res) => {
    Product.find()
        .then((data) => res.json(data))
        .catch((error) => res.json(error));
}


// Fetch all products excluding those sold by the logged-in user
const viewpro2 =  async (req, res) => {
    const userEmail = req.user.email; // Assuming you are using JWT and have middleware to set req.user

    try {
        const products = await Product.find({ 
            email: { $ne: userEmail }, // Exclude products sold by the logged-in user
            quantity: { $gt: 0 } // Only include products in stock
        });
        res.json(products);
    } catch (error) {
        res.json(error);
    }
}

const soldproductsuserId = async (req, res) => {

    
    const { userId } = req.params;

    Product.find({ userId: userId }) // Find products sold by the specified user
        .then((products) => {
            if (!products.length) {
                return res.status(404).json({ status: "error", message: "No sold products found." });
            }
            res.json({ status: "success", products });
        })
        .catch((error) => {
            console.error("Error fetching sold products:", error);
            res.status(500).json({ status: "error", message: error.message });
        });
}

module.exports = {
    addpro,
    searchpro,viewpro,
    viewpro2,
    deletepro,
    soldproductsuserId
}
