import express from "express";

// Local imports
import {
  createAccount,
  deleteAccount,
  getAccounts,
  getAccount,
  updateAccount,
} from "../controllers/account.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAccounts);
router.get("/:accountId", getAccount);

router.post("/", protect, createAccount);
router.put("/:accountId", protect, updateAccount);
router.delete("/:accountId", protect, deleteAccount);

export default router;
