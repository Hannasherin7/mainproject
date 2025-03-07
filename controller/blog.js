const express = require("express");
const BlogModel  = require("../models/blog");



const addblog = async (req, res) => {
    try {
        console.log(req.files);

        let input = req.body;

        req.files?.forEach((item) => {
            input.image = `uploads/${item?.filename}`; 
        });

        input.user = req.user.id;
        console.log(input);

        if (!input.title || !input.content || !input.image) {
            return res.status(400).json({ status: "error", message: "All fields are required" });
        }

        let newBlog = new BlogModel(input);
        await newBlog.save();

        res.status(201).json({ status: "success", data: newBlog });
    } catch (error) {
        console.error("Error adding blog:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
};

const getallblog = async (req, res) => {
  try {
    const blogs = await BlogModel.find().populate("userId", "name"); // Populate user details
    res.status(200).json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
}


const getownblog = async (req, res) => {
  const { userId } = req.params;

  try {
    const blogs = await BlogModel.find({ userId }).populate("userId", "name");
    res.status(200).json(blogs);
  } catch (error) {
    console.error("Error fetching user blogs:", error);
    res.status(500).json({ message: "Failed to fetch user blogs" });
  }
}


const deleteblog = async (req, res) => {
  const { blogId } = req.params;

  try {
    await BlogModel.findByIdAndDelete(blogId);
    res.status(200).json({ message: "Blog deleted successfully!" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ message: "Failed to delete blog" });
  }
}

module.exports = {
    addblog,
    getallblog,
    getownblog,
    deleteblog,
    
}