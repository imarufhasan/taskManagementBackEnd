const Task = require("../models/Task");

const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    if (!title?.trim()) {
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

const getMyTasks = async (req, res) => {
  try {
    const {
      search,
      status,
      priority,
      startDate,
      endDate,
      overdue,
      page = 1,
      limit = 10,
    } = req.query;

    let query = {
      user: req.user._id,
    };

    if (search) {
      query.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    if (startDate || endDate) {
      query.dueDate = {};

      if (startDate) {
        query.dueDate.$gte = new Date(startDate);
      }

      if (endDate) {
        query.dueDate.$lte = new Date(endDate);
      }
    }

    if (overdue === "true") {
      query.dueDate = {
        $lt: new Date(),
      };

      query.status = {
        $ne: "completed",
      };
    }

    // const sort = req.query.sort || "-createdAt";
    let sortOption = "-createdAt";

    switch (req.query.sort) {
      case "newest":
        sortOption = "-createdAt";
        break;

      case "oldest":
        sortOption = "createdAt";
        break;

      case "dueDate":
        sortOption = "dueDate";
        break;

      case "title":
        sortOption = "title";
        break;

      case "priority":
        sortOption = "priority";
        break;

      default:
        sortOption = "-createdAt";
    }
    const currentPage = Number(page);
    const pageLimit = Number(limit);

    const tasks = await Task.find(query)
      .sort(sortOption)
      .skip((currentPage - 1) * pageLimit)
      .limit(pageLimit);

    const total = await Task.countDocuments(query);

    res.json({
      status: true,

      total,

      currentPage,

      pageLimit,

      totalPages: Math.ceil(total / pageLimit),

      tasks,
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
    const reqSearch = { _id: req.params.id, user: req.user._id };
    const task = await Task.findOne(reqSearch);

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
    const reqSearch = { _id: req.params.id, user: req.user._id };
    const task = await Task.findOneAndUpdate(reqSearch, req.body, {
      new: true,
      runValidators: true,
    });

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
    const reqSearch = { _id: req.params.id, user: req.user._id };
    const task = await Task.findOneAndDelete(reqSearch);

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

const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        status: false,
        message: "Status is required",
      });
    }

    const reqSearch = { _id: req.params.id, user: req.user._id };

    const task = await Task.findOneAndUpdate(
      reqSearch,
      { status },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!task) {
      return res.status(404).json({
        status: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Task status updated successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const statistics = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalTasks = await Task.countDocuments({ user: userId });
    const completedTasks = await Task.countDocuments({
      user: userId,
      status: "completed",
    });
    const pendingTasks = await Task.countDocuments({
      user: userId,
      status: "pending",
    });
    const inProgressTasks = await Task.countDocuments({
      user: userId,
      status: "in-progress",
    });
    const highPriorityTasks = await Task.countDocuments({
      user: userId,
      priority: "high",
    });
    const mediumPriorityTasks = await Task.countDocuments({
      user: userId,
      priority: "medium",
    });
    const lowPriorityTasks = await Task.countDocuments({
      user: userId,
      priority: "low",
    });
    const urgentPriorityTasks = await Task.countDocuments({
      user: userId,
      priority: "urgent",
    });

    const overdueTasks = await Task.countDocuments({
      user: userId,
      dueDate: { $lt: new Date() },
      status: { $ne: "completed" },
    });

    res.status(200).json({
      status: true,
      message: "Statistics fetched successfully",
      data: {
        totalTasks,
        completedTasks,
        pendingTasks,
        inProgressTasks,
        priority: {
          highPriorityTasks,
          mediumPriorityTasks,
          lowPriorityTasks,
          urgentPriorityTasks,
        },
        overdueTasks,
      },
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
  getMyTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
  statistics,
};
