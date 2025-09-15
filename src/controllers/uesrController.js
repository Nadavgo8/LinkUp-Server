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
    ];
    const updates = {};
    allowed.forEach((k) => {
      if (req.body[k] !== undefined) updates[k] = req.body[k];
    });

    // location handling: expect { lat, lng } in body (או location.coordinates)
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
