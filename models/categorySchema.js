import { model, Schema } from "mongoose";

const categorySchema = new Schema({
    category:{
        type: String,
        required: true
    },

    image:{
        type: String,
        required: true
    },
    color:{
        type: String,
    }


    

},{timestamps:true})

export const Category = model("Category", categorySchema)