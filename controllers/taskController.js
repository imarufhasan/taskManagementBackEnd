const Task = require("../models/Task");

const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({
        status: false,
        message: "Title is required",
      });
    }

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      user: req.user._id,
    });

    res.status(201).json({
      status: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });

    if (!tasks) {
      return res.status(404).json({
        status: false,
        message: "No tasks found",
      });
    }

    const sortedTasks = tasks.sort((a, b) => {
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate) - new Date(b.dueDate);
      } else if (a.dueDate) {
        return -1; // a has a due date, b does not
      } else if (b.dueDate) {
        return 1; // b has a due date, a does not
      }
      return 0; // neither has a due date
    });

    res.status(200).json({
      status: true,
      message: "Tasks fetched successfully",
      tasks: sortedTasks,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({
        status: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Task fetched successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true },
    );

    if (!task) {
      return res.status(404).json({
        status: false,
        message: "Task not found",
      });
    }
    res.status(200).json({
      status: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        status: false,
        message: "Task not found",
      });
    }
    res.status(200).json({
      status: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
