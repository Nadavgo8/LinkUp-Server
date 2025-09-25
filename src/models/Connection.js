const { Schema, model, Types } = require("mongoose");

const ConnectionSchema = new Schema(
  {
    from: { type: Types.ObjectId, ref: "User", required: true, index: true },
    to:   { type: Types.ObjectId, ref: "User", required: true, index: true },
    goal: { type: String, required: true, index: true }, // 'dating' | 'sports' | ...
    decision: { type: String, enum: ["match", "pass"], required: true },
    expiresAt: { type: Date, index: true }
  },
  { timestamps: true }
);

ConnectionSchema.index({ from: 1, to: 1, goal: 1 }, { unique: true });

ConnectionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = model("Connection", ConnectionSchema);


// const { Schema, model } = require("mongoose");

// const ConnectionSchema = new Schema(
//   {
//     goal: { type: String, required: true },
//     userAID: { type: String, required: true },
//     userBID: { type: String, required: true },
//     aWantsToMatch: { type: Boolean, default: false },
//     bWantsToMatch: { type: Boolean, default: false },
//     showAToB: { type: Boolean, default: true },
//     showBToA: { type: Boolean, default: true },
//   },
//   { timestamps: true }
// );

// module.exports = model("Connection", ConnectionSchema);
