const express = require("express");
const bcrypt = require("bcryptjs");
const auth = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");
const User = require("../models/User");
const {
  getMe,
  updateMe,
  getUserById,
} = require("../controllers/uesrController");

const router = express.Router();

// Protected routes - require authentication
router.use(auth);

// GET /user/profile - Get logged in user profile
router.get("/profile", getMe);

// PUT /user/profile - Update user profile
router.put("/profile", updateMe);

// GET /user/:id - Get another user's profile
router.get("/:id", getUserById);

//Do we need option to change password ?
router.put("/change-password", async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ msg: "Current and new password are required" });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Current password incorrect" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ msg: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Upload user-ID to Cloudinary
router.post("/upload-id", upload.single("idDoc"), async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { idDocUrl: req.file.path, verified: true },
      { new: true }
    ).select("-password");

    res.json({ msg: "ID uploaded successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
