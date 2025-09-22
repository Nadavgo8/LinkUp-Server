const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    fullName: { type: String, required: true, maxlength: 30 },
    dob: { type: Date, required: true }, //date of birth
    bio: String,
    photoUrl: String,
    goals: {
      type: [String],
      set: (arr) => arr.map((s) => s.toLowerCase()),
    },
    languages: [{ type: String }],
    occupation: String,
    company: String,
    smoker: {
      type: String,
      enum: ["yes", "no", "occasionally", "prefer not to say"],
      lowercase: true,
      default: "prefer not to say",
    },
    relationshipStatus: {
      type: String,
      enum: ["single", "married", "divorced", "other", "prefer not to say"],
      lowercase: true,
      default: "prefer not to say",
    },
    education: String,
    interests: { type: [String], default: [] },
    city: String,
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [34.78, 32.08] }, // [lng, lat]
    },
    verified: { type: Boolean, default: false },
    idDocUrl: { type: String },
  },
  { timestamps: true }
);

//Adding geographic index
UserSchema.index({ location: "2dsphere" });

module.exports = model("User", UserSchema);
