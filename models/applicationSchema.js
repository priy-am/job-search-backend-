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
    match: /^[6-9]\d{9}$/,
    length: 10,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
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
    type: String, // store as file path or URL
    required: true,
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job", // assuming a Job model exists
    required: true,
  },
}, {
  timestamps: true,
});

export const  Application = model("Application", applicationSchema )
