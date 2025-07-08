import express from "express";
import { getAllCategories, createCategory } from "../controllers/categoryController.js";

const router = express.Router();
// Route to get all categories
router.get("/getCategory", getAllCategories);
// Route to create a new category
router.post("/create", createCategory);



export default router;