import mongoose, { model } from "mongoose";

const applicationSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
    trim: true,
  },
  mobile: {
    type: String,
    required: true,
    length: 10,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  experience: {
    type: Number,
    required: true,
    min: 0,
    max: 50,
  },
  bio: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 500,
    trim: true,
  },
  resume: {
    type: String,
    required: true,
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobPost",
    required: true,
  },
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  status: {
    type: String,
    enum: ["Submitted", "Under Review", "Shortlisted", "Rejected", "Accepted"],
    default: "Submitted",
  },
}, {
  timestamps: true,
});

applicationSchema.index({ jobId: 1, createdAt: -1 });
applicationSchema.index({ email: 1 });
applicationSchema.index({ applicantId: 1 });

export const Application = model("Application", applicationSchema);
