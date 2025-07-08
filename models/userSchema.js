import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: {
      type: String,
      enum: ["jobseeker", "recruiter"],
      required: true,
    },
  },
  { timestamps: true }
);

export const User = model("User", userSchema);
