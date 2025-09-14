const express = require("express");
const auth = require("../middlewares/authMiddleware");
const { discoverUsers } = require("../controllers/profilesController");

const router = express.Router();

router.get("/discover", auth, discoverUsers);

module.exports = router;
