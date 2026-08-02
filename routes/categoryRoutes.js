import express from "express";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();
// Route to get all categories
router.get("/getCategory", getAllCategories);
// Route to create a new category
router.post("/create", createCategory);
// Route to update a category
router.put("/update/:id", updateCategory);
// Route to delete a category
router.delete("/delete/:id", deleteCategory);

export default router;