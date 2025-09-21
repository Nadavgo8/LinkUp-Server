const User = require("../models/User");

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select("-password -idDocUrl");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.updateMe = async (req, res, next) => {
  try {
    const allowed = [
      "fullName",
      "bio",
      "photoUrl",
      "goals",
      "languages",
      "dob",
      "occupation",
      "company",
      "smoker",
      "relationshipStatus",
      "education",
      "interests",
      "city",
      "lat",
      "lng",
    ];
    const updates = {};
    allowed.forEach((k) => {
      if (req.body[k] !== undefined) updates[k] = req.body[k];
    });

    // normalize goals to lowercase
    if (updates.goals) {
      updates.goals = updates.goals.map((g) => g.toLowerCase());
    }

    // normalize interests if provided as CSV string
    if (updates.interests) {
      if (typeof updates.interests === "string") {
        updates.interests = updates.interests
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      } else if (Array.isArray(updates.interests)) {
        updates.interests = updates.interests.map((s) => String(s).trim());
      }
    }

    // normalize enums to lowercase
    if (updates.relationshipStatus)
      updates.relationshipStatus = String(
        updates.relationshipStatus
      ).toLowerCase();
    if (updates.smoker) updates.smoker = String(updates.smoker).toLowerCase();

    // location handling: expect { lat, lng } in body
    if (req.body.lat !== undefined && req.body.lng !== undefined) {
      updates.location = {
        type: "Point",
        coordinates: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
      };
    }

    const user = await User.findByIdAndUpdate(req.userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password -idDocUrl");
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-password -idDocUrl"
    );
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
};
