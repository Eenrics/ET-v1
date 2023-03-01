import express from "express";
import { createProject } from "../controllers/createprojectcontroller.js";
import checkRole from "../middleware/checkRole.js";
import requireAuth from "../middleware/requireAuth.js";
import { createTask } from "../controllers/createTask.js";

const router = express.Router();

router.post("/create-post", requireAuth, checkRole([0, 1]), createProject);
router.post("/create-task", requireAuth, checkRole([0, 1]), createTask);

export default router;
