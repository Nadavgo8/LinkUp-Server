const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    dob: { type: Date, required: true }, //date of birth
    bio: String,
    photoUrl: String,
    goals: [String],
    languages: [String],
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
    },
  },
  { timestamps: true }
);

//Adding geographic index
userSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("User", userSchema);
