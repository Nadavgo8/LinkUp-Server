const express = require("express");
const { check, validationResult } = require("express-validator");
const { register, login } = require("../controllers/authController");

const router = express.Router();

router.post(
  "/register",
  [
    check("email").isEmail(),
    check("password").isLength({ min: 6 }),
    check("fullName").notEmpty(),
    check("dob").isISO8601(),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    return register(req, res, next);
  }
);

router.post(
  "/login",
  [check("email").isEmail(), check("password").exists()],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    return login(req, res, next);
  }
);

module.exports = router;
