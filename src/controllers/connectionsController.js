const User = require("../models/User");
const Connection = require("../models/Connection");

// POST /connections/:targetId
exports.makeDecision = async (req, res, next) => {
  try {
    const { decision, goal } = req.body; // "match" | "pass"
    const { targetId } = req.params;
    const userId = req.userId;

    if (!["match", "pass"].includes(decision)) {
      return res.status(400).json({ message: "Invalid decision" });
    }

    // create or update connection
    const conn = await Connection.findOneAndUpdate(
      { from: userId, to: targetId, goal },
      { decision },
      { upsert: true, new: true }
    );

    // Check if reciprocal match exists
    if (decision === "match") {
      const reciprocal = await Connection.findOne({
        from: targetId,
        to: userId,
        decision: "match",
        goal,
      });
      if (reciprocal) {
        return res.json({ match: true, connection: conn });
      }
    }

    res.json({ match: false, connection: conn });
  } catch (err) {
    next(err);
  }
};
