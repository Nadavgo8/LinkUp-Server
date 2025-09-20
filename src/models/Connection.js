const { Schema, model, Types } = require("mongoose");

const ConnectionSchema = new Schema(
  {
    from: { type: Types.ObjectId, ref: "User", required: true, index: true },
    to:   { type: Types.ObjectId, ref: "User", required: true, index: true },
    goal: { type: String, required: true, index: true }, // 'dating' | 'sports' | ...
    decision: { type: String, enum: ["match", "pass"], required: true },
  },
  { timestamps: true }
);

ConnectionSchema.index({ from: 1, to: 1, goal: 1 }, { unique: true });

module.exports = model("Connection", ConnectionSchema);
