const express = require("express");
const { check, validationResult } = require("express-validator");
const auth = require("../middlewares/authMiddleware");
const { getEvents, createEvent } = require("../controllers/eventController");

const router = express.Router();

router.use(auth);

router.get("/events", getEvents);

router.post(
  "/events",
  [
    check("title").notEmpty().withMessage("Title is required"),
    check("description").notEmpty().withMessage("Description is required"),
    check("date").isISO8601().withMessage("Valid date is required"),
    check("location.lat").isFloat().withMessage("Valid latitude is required"),
    check("location.lng").isFloat().withMessage("Valid longitude is required"),
    check("maxParticipants")
      .isInt({ min: 2 })
      .withMessage("At least 2 participants required"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    return createEvent(req, res, next);
  }
);

module.exports = router;
