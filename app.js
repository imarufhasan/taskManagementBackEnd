const express = require("express");

const requestLogger = require("./src/middleware/requestLogger");

const authRoutes = require("./src/routes/authRoutes");
const taskRoutes = require("./src/routes/taskRoutes");
const errorHandler = require("./src/middleware/errorMiddleware")

const app = express();

// Middleware
app.use(express.json());

app.use(requestLogger);

// Routes

app.use("/api/auth", authRoutes);

app.use("/api/tasks", taskRoutes);

app.use(errorHandler);
// Health check

app.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    message: "Task Manager API is running 🚀",
  });
});

// 404 Route

app.use((req, res) => {
  res.status(404).json({
    status: false,
    message: "Route not found",
  });
});

module.exports = app;
