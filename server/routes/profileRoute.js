import express from "express";
const router = express.Router();
import {
  getProfile,
  updateProfile,
  updateUser,
} from "../controllers/profile/profileController.js";
import requireAuth from "../middleware/requireAuth.js";

router.get("/profile", requireAuth, getProfile);
router.patch("/profile", requireAuth, updateUser);
router.patch("/full-profile", requireAuth, updateProfile);
export default router;
