// routes/blogRoutes.js
import express from "express";
import { getMulterUpload } from "../middleware/multer.js";
import { createBlog, getAllBlogs, getBlogById } from "../controllers/blogController.js";
import isAuthenticated from "../config/auth.js";

const router = express.Router();

const uploadBlogImage = getMulterUpload("uploads", ["image/"], 2 * 1024 * 1024); // 2 MB
router.post("/createBlog", isAuthenticated , uploadBlogImage.single("image"), createBlog);
router.get("/allBlogs", getAllBlogs);
router.get("/blogBy/:id", getBlogById);

export default router;
