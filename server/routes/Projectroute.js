import express from "express";
import { createProject } from "../controllers/project/createprojectcontroller.js";
import checkRole from "../middleware/checkRole.js";
import requireAuth from "../middleware/requireAuth.js";
import { createTask } from "../controllers/task/createTask.js";
import getProject from "../controllers/project/getProject.js";
import getAllProjects from "../controllers/project/getProjects.js";
import getTask from "../controllers/task/getTask.js";
import getAllTasks from "../controllers/task/getTasks.js";

const router = express.Router();

router.post("/create-project", requireAuth, checkRole([0, 1]), createProject);
router.get("/project/:id", requireAuth, checkRole([0, 1]), getProject);
router.get("/projects", requireAuth, checkRole([0, 1]), getAllProjects);
router.post("/create-task", requireAuth, checkRole([0, 1]), createTask);
router.get("/task/:id", requireAuth, checkRole([0, 1]), getTask);
router.get("/tasks", requireAuth, checkRole([0, 1]), getAllTasks);

export default router;
