const mongoose = require("mongoose");
const User = require("../models/User");

const Connection = require("../models/Connection");

exports.discoverUsers = async (req, res, next) => {
  try {
    let { lat, lng, radius, goals, goal, langs } = req.query;

    const goalsParam = goals || goal || "";
    const goalsArray = goalsParam
      ? Array.isArray(goalsParam)
        ? goalsParam.map((g) => String(g).trim().toLowerCase())
        : String(goalsParam)
            .split(",")
            .map((s) => s.trim().toLowerCase())
      : [];

    const langsArray = langs
      ? String(langs)
          .split(",")
          .map((s) => s.trim().toLowerCase())
      : [];

    radius = parseFloat(radius) || 20; // km
    const radiusInMeters = radius * 1000;

    // If lat/lng not provided, try to use current user's stored location
    if (!lat || !lng) {
      const me = await User.findById(req.userId).select("location");
      if (
        !me ||
        !me.location ||
        !Array.isArray(me.location.coordinates) ||
        me.location.coordinates.length < 2
      ) {
        return res
          .status(400)
          .json({ message: "lat/lng required or set your profile location" });
      }
      [lng, lat] = me.location.coordinates;
    }


    const passQuery = {
        from: new mongoose.Types.ObjectId(req.userId),
        decision: 'pass',
        expiresAt: { $gt: new Date() },
      };
    if (goalsArray.length === 1) passQuery.goal = goalsArray[0];
    else if (goalsArray.length > 1) passQuery.goal = { $in: goalsArray };
    const passDocs = await Connection.find(passQuery).select('to');
   

    const matchQuery = {
      from: new mongoose.Types.ObjectId(req.userId),
      decision: 'match',
    };
    if (goalsArray.length === 1) matchQuery.goal = goalsArray[0];
    else if (goalsArray.length > 1) matchQuery.goal = { $in: goalsArray };
    const matchDocs = await Connection.find(matchQuery).select('to');

    const blockedIds = [...passDocs, ...matchDocs].map(d => d.to);

    
    // ensure numbers
    const lngNum = parseFloat(lng);
    const latNum = parseFloat(lat);


    const baseQuery = {
      _id: { $ne: new mongoose.Types.ObjectId(req.userId) }
    };
    if (blockedIds.length) baseQuery._id.$nin = blockedIds;

    const pipeline = [
      {
        $geoNear: {
          near: { type: "Point", coordinates: [lngNum, latNum] },
          distanceField: "distanceMeters",
          maxDistance: radiusInMeters,
          spherical: true,
          // query: {
          //   _id: { $ne: new mongoose.Types.ObjectId(req.userId) }, // exclude self
          // },
          query: baseQuery,
        },
      },
      // optional filters
      ...(goalsArray.length
        ? [{ $match: { goals: { $in: goalsArray } } }]
        : []),
      ...(langsArray.length
        ? [{ $match: { languages: { $in: langsArray } } }]
        : []),
      { $limit: 50 },
      {
        $addFields: {
          distanceKm: { $round: [{ $divide: ["$distanceMeters", 1000] }, 1] },
        },
      },
      {
        $unset: ["password", "idDocUrl", "distanceMeters"],
      },
    ];

    const users = await User.aggregate(pipeline);
    res.json({ count: users.length, users });
  } catch (err) {
    console.error("discoverUsers error:", err);
    next(err);
  }
};
