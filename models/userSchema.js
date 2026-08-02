import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
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
