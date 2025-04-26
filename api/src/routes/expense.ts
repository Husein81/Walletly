import express from "express";
import {
  createExpense,
  deleteExpense,
  getExpenses,
  updateExpense,
} from "../controllers/expense.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.get("/", getExpenses);
router.get("/:expenseId", getExpenses);

router.post("/", protect, createExpense);
router.put("/:expenseId", protect, updateExpense);
router.delete("/:expenseId", protect, deleteExpense);

export default router;
