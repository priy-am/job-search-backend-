// controllers/blogController.js
import { Blog } from "../models/blogSchema.js";

export const createBlog = async (req, res) => {
  try {
    const { title, description, content, tags, writer } = req.body;

    // Image file should be uploaded via multipart/form-data
    const image = req.file;

    if (!image) {
      return res.status(400).json({ message: "Image is required." });
    }

    const newBlog = new Blog({
      title,
      description,
      content,
      imageUrl: `/uploads/${image.filename}`, // Local image path
      tags,
      writer,
    });

    await newBlog.save();

    res.status(201).json({ message: "Blog created successfully", blog: newBlog });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 }); // Most recent first
    res.status(200).json({ blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ message: "Failed to fetch blogs", error });
  }
};

// GET /api/blogs/:id
export const getBlogById = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({ blog });
  } catch (error) {
    console.error("Error fetching blog by ID:", error);
    res.status(500).json({ message: "Failed to fetch blog", error });
  }
};


