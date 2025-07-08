import { Category } from "../models/categorySchema.js";

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
};

export const createCategory = async (req, res) => {
  const { category, image, color } = req.body;
  try {
    const newCategory = new Category({ category, image, color });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: "Error creating category", error });
  }
};

export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { category, image, color } = req.body;

  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { category },
      {image},
      {color},
      { new: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: "Error updating category", error });
  }
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category", error });
  }
};

export const removeDuplicate = async (req, res) => {
  const { id } = req.params;

  try {
    
  } catch (error) {
    res.status(500).json({ message: "Error duplicating category", error });
  }
}
