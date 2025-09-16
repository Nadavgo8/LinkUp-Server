// const mongoose = require("mongoose");

// const eventSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   description: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   date: {
//     type: Date,
//     required: true,
//   },
//   location: {
//     type: {
//       type: String,
//       enum: ["Point"],
//       default: "Point",
//     },
//     coordinates: {
//       type: [Number], // [lng, lat]
//       required: true,
//     },
//   },
//   organizer: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   participants: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//   ],
//   maxParticipants: {
//     type: Number,
//     required: true,
//     min: 2,
//   },
//   goal: {
//     type: String,
//     enum: ["dating", "friendship", "activity", "professional"],
//     required: true,
//   },
//   tags: [
//     {
//       type: String,
//       trim: true,
//     },
//   ],
//   status: {
//     type: String,
//     enum: ["active", "cancelled", "completed"],
//     default: "active",
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// eventSchema.index({ location: "2dsphere" });
// eventSchema.index({ date: 1 });
// eventSchema.index({ goal: 1 });
// eventSchema.index({ organizer: 1 });

// module.exports = mongoose.model("Event", eventSchema);
