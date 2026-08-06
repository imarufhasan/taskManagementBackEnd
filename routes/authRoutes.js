const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  deleteProfile,
  changePassword,
  getAllUsers,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

// public
router.post("/register", registerUser);

router.post("/login", loginUser);

// protected
router.get("/profile", protect, getProfile);

router.put("/profile", protect, updateProfile);

router.delete("/profile", protect, deleteProfile);

router.put("/change-password", protect, changePassword);

router.get("/users", protect, getAllUsers);

module.exports = router;

