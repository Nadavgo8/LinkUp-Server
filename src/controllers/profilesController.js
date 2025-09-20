const User = require("../models/User");
const Connection = require("../models/Connection");

exports.discoverUsers = async (req, res, next) => {
  try {
    let { lat, lng, radius, goals, langs } = req.query;
    radius = parseFloat(radius) || 20;
    const radiusInMeters = radius * 1000;

    const goalsArray = goals
      ? goals.split(",").map((s) => s.trim().toLowerCase())
      : [];
    const langsArray = langs
      ? langs.split(",").map((s) => s.trim().toLowerCase())
      : [];

    // Exclude users that the logged-in user has already passed on
    const passFilter = { from: req.userId, decision: "pass" };
    if (goalsArray.length) passFilter.goal = { $in: goalsArray };
    const passes = await Connection.find(passFilter).select("to").lean();
    const excludeIds = passes.map((d) => d.to);

    if (!lat || !lng) {
      const me = await User.findById(req.userId);
      if (!me || !me.location || !me.location.coordinates) {
        return res
          .status(400)
          .json({ message: "lat/lng required or set your profile location" });
      }
      [lng, lat] = me.location.coordinates;
    }

    const pipeline = [
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          distanceField: "distanceMeters",
          maxDistance: radiusInMeters,
          spherical: true,
          // query: { _id: { $ne: req.userId } },
           query: {
            _id: {
              $ne: req.userId,
              ...(excludeIds.length ? { $nin: excludeIds } : {}),
            },
          },
        },
      },
      {
        $match: {
          ...(goalsArray.length ? { goals: { $in: goalsArray } } : {}),
          ...(langsArray.length ? { languages: { $in: langsArray } } : {}),
        },
      },
      { $limit: 50 },
      {
        $addFields: {
          distanceKm: { $round: [{ $divide: ["$distanceMeters", 1000] }, 1] },
        },
      },
      {
        $project: {
          password: 0,
          idDocUrl: 0,
          distanceMeters: 0,
        },
      },
    ];

    const users = await User.aggregate(pipeline);
    console.log(
      `Found ${users.length} users with goals: ${goalsArray.join(", ")}`
    ); // debug
    res.json({ count: users.length, users });
  } catch (err) {
    console.error("Error in discoverUsers:", err); // debug
    next(err);
  }
};
