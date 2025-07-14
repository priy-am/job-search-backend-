import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true }, // HTML from TinyMCE
  imageUrl: { type: String, required: true },
  tags: { type: String },
  writer: { type: String },
},{timestamps:true});

export const Blog = mongoose.model("Blog", blogSchema);
