const Product =require("../models/Product");
const mongoose = require("mongoose");
const Order=require("../models/buy");
const agric=require("../models/agri")




// const addpro = async (req, res) => {
//     try {
//         const input = req.body;
//         input.userId = new mongoose.Types.ObjectId(req.user.id);
//         const product = new Product(input);
//         await product.save();
//         console.log("Product added:", product);
//         res.json({ status: "success", data: product });
//     } catch (error) {
//         console.error("Error adding product:", error);
//         res.status(500).json({ status: "error", message: error.message });
//     }
// };
const addpro = async (req, res) => {
    try {
        console.log(req.files);

        let input = req.body;

        // Handling file upload
        req.files?.forEach((item) => {
            input.image = `uploads/${item?.filename}`;
        });

        input.userId = new mongoose.Types.ObjectId(req.user.id);
        console.log(input);

        if (!input.pname || !input.discription || !input.price || !input.quantity || !input.image) {
            return res.status(400).json({ status: "error", message: "All fields are required" });
        }

        const product = new Product(input);
        await product.save();

        res.status(201).json({ status: "success", data: product });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
};



// Search products route
const searchpro = (req, res) => {
    const input = req.body;
    Product.find(input)
        .then((data) => res.json(data))
        .catch((error) => res.json(error));
}

// Delete product route
 const deletepro = async (req, res) => {
    const { id } = req.body;
    try {
      const result = await Product.deleteOne({ _id: id }); // Assuming MongoDB
      if (result.deletedCount === 1) {
        res.status(200).json({ status: "success", message: "Product deleted successfully" });
      } else {
        res.status(404).json({ status: "error", message: "Product not found" });
      }
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  }


  const deleteprobyadmin = async (req, res) => {
    const { id } = req.body;
  
    // Input validation
    if (!id) {
      return res.status(400).json({ status: "error", message: "Product ID is required" });
    }
  
    try {
      // Check if the ID is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ status: "error", message: "Invalid Product ID" });
      }
  
      // Delete the product
      const result = await Product.deleteOne({ _id: id });
  
      // Check if the product was found and deleted
      if (result.deletedCount === 1) {
        return res.status(200).json({ status: "success", message: "Product deleted successfully" });
      } else {
        return res.status(404).json({ status: "error", message: "Product not found" });
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      return res.status(500).json({ status: "error", message: "Internal server error" });
    }
  };
// View all products route
// const viewpro = async (req, res) => {
//     Product.find()
//         .then((data) => res.json(data))
//         .catch((error) => res.json(error));
// }

const viewallpro = async (req, res) => {
    try {
        const products = await Product.find().populate('userId', 'name email'); // Fetch seller's name & email
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const viewpro = async (req, res) => {
    try {
        console.log('test')
        const products = await Product.find({}).populate('feedbacks').populate({ 
            path: 'feedbacks',
            populate: {
              path: 'userId',
            } 
         }).exec();

        console.log('Populated Products:', JSON.stringify(products, null, 2)); 


        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

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

    Product.find({ userId: userId }) 
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

const checkeligibility = async (req, res) => {
    const { productId } = req.params;
    const userId = req.user.id; 

    try {
        const order = await Order.findOne({
            productId,
            userId,
            status: 'delivered'
        });

        if (order) {
            res.json({ eligible: true, orderId: order._id });
        } else {
            res.json({ eligible: false });
        }
    } catch (error) {
        console.error('Error checking eligibility:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// const submitfeedback = async (req, res) => {
//     const { text, rating, userId, productId, orderId } = req.body;

//     try {
//         const product = await Product.findById(productId);
//         if (!product) {
//             return res.status(404).json({ message: 'Product not found' });
//         }

//         product.feedbacks.push({ text, rating, userId, orderId });
//         await product.save();

//         res.json({ message: 'Feedback submitted successfully' });
//     } catch (error) {
//         console.error('Error submitting feedback:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// }



const editpeoduct = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    // Input validation
    if (!id) {
        return res.status(400).json({ status: "error", message: "Product ID is required" });
    }

    try {
        // Check if the ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ status: "error", message: "Invalid Product ID" });
        }

        // Update the product
        const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });

        if (updatedProduct) {
            return res.status(200).json({ status: "success", message: "Product updated successfully", data: updatedProduct });
        } else {
            return res.status(404).json({ status: "error", message: "Product not found" });
        }
    } catch (error) {
        console.error("Error updating product:", error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}


const getproduct = async (req, res) => {
    const { productId } = req.params;
  
    // Input validation
    if (!productId) {
      return res.status(400).json({ status: "error", message: "Product ID is required" });
    }
  
    try {
      // Check if the ID is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ status: "error", message: "Invalid Product ID" });
      }
  
      // Find the product by ID
      const product = await Product.findById(productId);
  
      if (product) {
        return res.status(200).json({ status: "success", data: product });
      } else {
        return res.status(404).json({ status: "error", message: "Product not found" });
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      return res.status(500).json({ status: "error", message: "Internal server error" });
    }
  }

  

module.exports = {
    addpro,
    searchpro,viewpro,
    viewpro2,
    deletepro,
    soldproductsuserId,
    checkeligibility,
    viewallpro,
    deleteprobyadmin,
    editpeoduct,
    getproduct
    //submitfeedback
    
}
