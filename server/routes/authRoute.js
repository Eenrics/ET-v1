import express from "express";
import registerUser from "../controllers/auth/registerController.js";
import verifyEmail from "../controllers/auth/verifyEmail.js";
import loginUser from "../controllers/auth/loginController.js";
import logoutUser from "../controllers/auth/logoutController.js";
import requireAuth from "../middleware/requireAuth.js";
import forgotPassword from "../controllers/auth/forgotPassword.js";
import resetPassword from "../controllers/auth/resetPassword.js";

const router = express.Router();

router.post("/register", registerUser);
router.get("/verify-email", verifyEmail);
router.post("/login", loginUser);
router.get("/logout", requireAuth, logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
