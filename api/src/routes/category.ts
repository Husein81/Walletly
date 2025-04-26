import express from "express";

// Local imports
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from "../controllers/category.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.get("/", getCategories);
router.get("/:categoryId", getCategory);

router.post("/", protect, createCategory);
router.put("/:categoryId", protect, updateCategory);
router.delete("/:categoryId", protect, deleteCategory);

export default router;
