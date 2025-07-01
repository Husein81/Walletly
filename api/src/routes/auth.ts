import express from "express";

// Local imports
import { login, register } from "../controllers/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);

export default router;
