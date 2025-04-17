import express from "express";
import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  getTaskStats,
  getTrashedTasks,
  restoreTask,
  deleteTaskPermanently,
} from "../controllers/taskController.js";
import { protectRoute } from "../middlewares/authMiddlewave.js";

const router = express.Router();

// Protect all routes
router.use(protectRoute);

// Special routes (must come before parameterized routes)
router.get("/stats", getTaskStats);
router.get("/trash", getTrashedTasks);

// Base routes
router.route("/").get(getTasks).post(createTask);

// Parameterized routes
router.post("/:id/restore", restoreTask);
router.delete("/:id/permanent", deleteTaskPermanently);
router.patch("/:id/status", updateTaskStatus);
router.route("/:id").get(getTask).put(updateTask).delete(deleteTask);

export default router;