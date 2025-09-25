// const User = require("../models/User");
// const Connection = require("../models/Connection");

// // POST /connections/:targetId
// exports.makeDecision = async (req, res, next) => {
//   try {
//     const { decision, goal } = req.body; // "match" | "pass"
//     const { targetId } = req.params;
//     const userId = req.userId;

//     if (!["match", "pass"].includes(decision)) {
//       return res.status(400).json({ message: "Invalid decision" });
//     }

//     // create or update connection
//     const conn = await Connection.findOneAndUpdate(
//       { from: userId, to: targetId, goal },
//       { decision },
//       { upsert: true, new: true }
//     );

//     // Check if reciprocal match exists
//     if (decision === "match") {
//       const reciprocal = await Connection.findOne({
//         from: targetId,
//         to: userId,
//         decision: "match",
//         goal,
//       });
//       if (reciprocal) {
//         return res.json({ match: true, connection: conn });
//       }
//     }

//     res.json({ match: false, connection: conn });
//   } catch (err) {
//     next(err);
//   }
// };

const User = require("../models/User");
const Connection = require("../models/Connection");
const { ensureDm } = require("../services/chatService");

// POST /connections/:targetId
exports.makeDecision = async (req, res, next) => {
  try {
    const { decision, goal } = req.body; // "match" | "pass"
    const { targetId } = req.params;
    const userId = req.userId;

    if (!["match", "pass"].includes(decision)) {
      return res.status(400).json({ message: "Invalid decision" });
    }
    if (userId === targetId) {
      return res.status(400).json({ message: "Cannot match with yourself" });
    }

    // Create or update the outgoing decision
    const conn = await Connection.findOneAndUpdate(
      { from: userId, to: targetId, goal },
      { decision },
      { upsert: true, new: true }
    );

    let matched = false;
    let dm = null;

    if (decision === "match") {
      const reciprocal = await Connection.findOne({
        from: targetId,
        to: userId,
        decision: "match",
        goal,
      });

      if (reciprocal) {
        matched = true;
        // 🔗 create/ensure DM & send greetings
        const serverClient = req.app.get("serverClient");
        try {
          dm = await ensureDm(serverClient, userId, targetId, goal);
        } catch (e) {
          // Don't fail the match because chat failed; just log it.
          console.error("ensureDm failed:", e);
        }
      }
    }

    return res.json({ match: matched, connection: conn, dm });
  } catch (err) {
    next(err);
  }
};
