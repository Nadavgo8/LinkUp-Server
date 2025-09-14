const express = require("express");
const auth = require("../middlewares/authMiddleware");
const { getMe, updateMe } = require("../controllers/uesrController");

const router = express.Router();

router.get("/me", auth, getMe); //consider change "/me" route name
router.put("/me", auth, updateMe);

module.exports = router;
