const Event = require("../models/Events");

// GET /events
exports.getEvents = async (req, res, next) => {
  try {
    const { goal, lat, lng, radius = 10, dateFrom, dateTo } = req.query;

    let query = {};

    if (goal) {
      query.goal = goal;
    }

    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) query.date.$gte = new Date(dateFrom);
      if (dateTo) query.date.$lte = new Date(dateTo);
    }

    let events;

    if (lat && lng) {
      events = await Event.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [parseFloat(lng), parseFloat(lat)],
            },
            distanceField: "distance",
            maxDistance: radius * 1000,
            query: query,
            spherical: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "organizer",
            foreignField: "_id",
            as: "organizer",
            pipeline: [{ $project: { fullName: 1, photoUrl: 1 } }],
          },
        },
        {
          $unwind: "$organizer",
        },
        {
          $lookup: {
            from: "users",
            localField: "participants",
            foreignField: "_id",
            as: "participants",
            pipeline: [{ $project: { fullName: 1, photoUrl: 1 } }],
          },
        },
      ]);
    } else {
      events = await Event.find(query)
        .populate("organizer", "fullName photoUrl")
        .populate("participants", "fullName photoUrl")
        .sort({ date: 1 });
    }

    res.json(events);
  } catch (err) {
    next(err);
  }
};

// POST /events
exports.createEvent = async (req, res, next) => {
  try {
    const { title, description, date, location, maxParticipants, goal, tags } =
      req.body;

    const newEvent = new Event({
      title,
      description,
      date: new Date(date),
      location: {
        type: "Point",
        coordinates: [parseFloat(location.lng), parseFloat(location.lat)],
      },
      organizer: req.userId,
      maxParticipants,
      participants: [req.userId],
      goal,
      tags: tags || [],
    });

    await newEvent.save();

    await newEvent.populate("organizer", "fullName photoUrl");

    res.status(201).json(newEvent);
  } catch (err) {
    next(err);
  }
};
