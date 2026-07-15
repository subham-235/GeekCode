const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: { type: String, required: false, minLength: 3, maxLength: 30 },
    lastName: { type: String, required: false },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      immutable: true,
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    problemSolved: {
      type: [{ type: Schema.Types.ObjectId, ref: "problem" }],
      default: [],
    },
    googleId: { type: String, required: true, unique: true },
    avatar: { type: String },
  },
  { timestamps: true },
);

const Googleuser = mongoose.model("Googleuser", userSchema);
module.exports = Googleuser;
