import { model, Schema } from "mongoose";

const jobpostSchema = new Schema({
    jobTitle: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    skills: {
        type: [String],
        default: [],
    },
    experience: {
        type: Number,
        required: true,
        min: 0,
    },
    salary: {
        type: Number,
        required: true,
        min: 0,
    },
    role: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        required: true,
    },
    duration: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
        trim: true,
    },
    company: {
        type: String,
        required: true,
        trim: true,
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    recruiterId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
}, { timestamps: true });

jobpostSchema.index({ categoryId: 1, createdAt: -1 });
jobpostSchema.index({ recruiterId: 1, createdAt: -1 });
jobpostSchema.index({ jobTitle: "text", description: "text", location: "text" });

export const JobPost = model("JobPost", jobpostSchema);