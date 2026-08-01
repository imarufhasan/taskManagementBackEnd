const express = require("express");

const router = express.Router();

const { registerUser, loginUser, getAllUsers } = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/profile", protect, (req, res) => {
  res.json(req.user);
});

router.get("/users", protect, getAllUsers);

module.exports = router;
