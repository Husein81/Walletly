import express from "express";

// Local imports
import {
  completeRegistration,
  sendOtp,
  verifyOtp,
} from "../controllers/auth.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.put("/complete-registration/:userId", completeRegistration);

export default router;
