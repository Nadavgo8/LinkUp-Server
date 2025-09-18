const express = require("express");
const auth = require("../middlewares/authMiddleware");
const { makeDecision } = require("../controllers/connectionsController");

const router = express.Router();

router.post("/:targetId", auth, makeDecision);

module.exports = router;
