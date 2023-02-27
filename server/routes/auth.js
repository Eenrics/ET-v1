import express from "express";
import registerUser from "../controllers/registerController.js";
import verifyEmail from "../controllers/verifyEmail.js";
import loginUser from "../controllers/loginController.js";
import logoutUser from "../controllers/logoutController.js";
import requireAuth from "../middleware/requireAuth.js";
import forgotPassword from "../controllers/forgotPassword.js";
import resetPassword from "../controllers/resetPassword.js";

const router = express.Router();

router.post("/register", registerUser);
router.get("/verify-email", verifyEmail);
router.post("/login", loginUser);
router.get("/logout", requireAuth, logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
