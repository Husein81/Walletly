import express from "express";

// Local imports
import {
  completeRegistration,
  sendOtp,
  verifyOtp,
} from "../controllers/auth.js";

const router = express.Router();

router.post("/sendOtp", sendOtp);
router.post("/verifyOtp", verifyOtp);
router.put("/complete-registration/:userId", completeRegistration);

export default router;
