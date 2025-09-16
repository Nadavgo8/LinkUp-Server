const express = require("express");
const auth = require("../middlewares/authMiddleware");
const { discoverUsers } = require("../controllers/profilesController");

const router = express.Router();

router.get("/discover", auth, discoverUsers);

// GET /profiles/searchbuddy - Find users with same purpose/goal
router.get("/searchbuddy", auth, async (req, res) => {
  try {
    // Controller logic:
    // 1. Get the purpose/goal of the logged in user (req.userId)
    // 2. Find other users with the same purpose/goal in the database
    res.json({ msg: "Search results for buddies" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
