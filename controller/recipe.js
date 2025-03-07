const recipemodel=require("../models/recipe")
const mongoose = require("mongoose");
const addrec = async (req, res) => {
    try {
        console.log("Logged-in user:", req.user); // Debugging user info
        console.log("Uploaded files:", req.files); // Logging uploaded files

        let input = req.body;

        // Ensure user is authenticated
        if (!req.user || !req.user.id) {
            return res.status(401).json({ status: "error", message: "Unauthorized: User ID missing" });
        }

        // Handling file uploads
        if (req.files && req.files.length > 0) {
            input.imager = `uploads/${req.files[0].filename}`;
        }

        // Adding userId to input
        input.userId = req.user.id;

        // Validation to check required fields
        if (!input.titler || !input.descriptionr || !input.typer || !input.imager || !input.incredientsr) {
            return res.status(400).json({ status: "error", message: "All fields are required" });
        }

        let newRecipe = new recipemodel(input);
        await newRecipe.save();

        res.status(201).json({ status: "success", data: newRecipe });
    } catch (error) {
        console.error("Error adding recipe:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
};

const searchrec= async (req,res)=>{
    let input=req.body
    recipemodel.find(input).then((data)=>{
        res.json(data)
    }
    ).catch((error)=>{
        res.json(error)
    })
}

const deleterec= async (req,res)=>{
    const { recipeId } = req.body;

  // Input validation
  if (!recipeId) {
    return res.status(400).json({ status: "error", message: "Recipe ID is required" });
  }

  try {
    // Check if the recipe ID is valid
    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      return res.status(400).json({ status: "error", message: "Invalid Recipe ID" });
    }

    // Delete the recipe
    const result = await recipemodel.deleteOne({ _id: recipeId });

    // Check if the recipe was found and deleted
    if (result.deletedCount === 1) {
      return res.status(200).json({ status: "success", message: "Recipe deleted successfully" });
    } else {
      return res.status(404).json({ status: "error", message: "Recipe not found" });
    }
  } catch (error) {
    console.error("Error deleting recipe:", error);
    return res.status(500).json({ status: "error", message: "Internal server error" });
  }
}


const viewrec = async (req,res)=>{
    recipemodel.find().then((data)=>{
        res.json(data)
    }).catch((error)=>{
        res.json(error)
    })
}


const getUserRecipes = async (req, res) => {
    try {
        console.log("Logged-in user:", req.user); // Debugging line

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized: User ID missing" });
        }

        const userId = req.user.id; 
        const recipes = await recipemodel.find({ userId });

        res.json(recipes);
    } catch (error) {
        console.error("Error fetching recipes:", error);
        res.status(500).json({ message: "Error fetching recipes", error });
    }
};



const deleterecipebyadmin = async (req, res) => {
    const { id } = req.body;
  
    // Input validation
    if (!id) {
      return res.status(400).json({ status: "error", message: "Recipe ID is required" });
    }
  
    try {
      // Check if the ID is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ status: "error", message: "Invalid Recipe ID" });
      }
  
      // Delete the recipe
      const result = await recipemodel.deleteOne({ _id: id });
  
      // Check if the recipe was found and deleted
      if (result.deletedCount === 1) {
        return res.status(200).json({ status: "success", message: "Recipe deleted successfully" });
      } else {
        return res.status(404).json({ status: "error", message: "Recipe not found" });
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
      return res.status(500).json({ status: "error", message: "Internal server error" });
    }
  }
  

module.exports = {
    addrec,
    searchrec,deleterec,
    viewrec,
    getUserRecipes,deleterecipebyadmin
}