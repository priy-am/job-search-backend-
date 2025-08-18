import { model, Schema } from "mongoose";

const jobpostSchema = new Schema({

    jobTitle:{
        type: String,
        required: true,
    },

    description:{
        type:String,
        required:true
    },

    skills:{
        type:Array,
        required:true
    },
    
    experience:{
        type:Number,
        required: true
    },
    
    salary:{
        type:Number,
        required:true
    },

    role:{
        type:String,
        required:true
    },

    image:{
        type:String,
        required:true
    },
    duration:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    company:{
        type:String,
        required:true
    },

    categoryId:{
        type:Schema.Types.ObjectId,
        ref:"Category",
        required:true
    },

    recruiterId:{
        type:Schema.Types.ObjectId,
        ref: "User",
        required: true
    }


},{timestamps:true})

export const JobPost = model("JobPost", jobpostSchema)