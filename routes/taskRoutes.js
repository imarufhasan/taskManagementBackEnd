const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createTask,
  getMyTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
  statistics,
} = require("../controllers/taskController");

router.use(protect);

router.post("/create", createTask);

router.get("/getMyTasks", getMyTasks);

router.get("/statistics", statistics);

router.get("/:id", getTaskById);

router.put("/:id", updateTask);

router.put("/:id/status", updateTaskStatus);

router.delete("/:id", deleteTask);

module.exports = router;
