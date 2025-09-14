const User = require("../models/User");

exports.discoverUsers = async (req, res, next) => {
  try {
    // query params: lat, lng, radius (km), goals (comma), langs (comma)
    let { lat, lng, radius, goals, langs } = req.query;
    radius = parseFloat(radius) || 20; // km
    const radiusInMeters = radius * 1000;

    const goalsArray = goals ? goals.split(",").map((s) => s.trim()) : [];
    const langsArray = langs ? langs.split(",").map((s) => s.trim()) : [];

    if (!lat || !lng) {
      const me = await User.findById(req.userId);
      if (!me || !me.location || !me.location.coordinates) {
        return res
          .status(400)
          .json({ msg: "lat/lng required or set your profile location" });
      }
      [lng, lat] = me.location.coordinates;
    }

    const filter = {
      _id: { $ne: req.userId },
    };

    if (goalsArray.length) filter.goals = { $in: goalsArray };
    if (langsArray.length) filter.languages = { $in: langsArray };

    filter.location = {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(lng), parseFloat(lat)],
        },
        $maxDistance: radiusInMeters,
      },
    };

    const users = await User.find(filter)
      .select("-password -idDocUrl")
      .limit(50);
    res.json({ count: users.length, users });
  } catch (err) {
    next(err);
  }
};
