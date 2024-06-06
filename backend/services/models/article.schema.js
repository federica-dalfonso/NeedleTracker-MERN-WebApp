import { Schema, model } from "mongoose";

const articleSchema = new Schema(
    {
        category: {
            type: String,
            required: true
        },

        title: {
            type: String, 
            required: true
        },

        cover: {
            type: String, 
            required: true
        }, 

        resume: {
            type: String,
            required: true
        }, 

        content: {
            type: String,
            required: true
        }, 

        _author: {
            type: Schema.Types.ObjectId, 
            ref: "User",
            required: true
        }
    }, 

    {
        timestamps: true,
        collection: "articles"
    }
)

export default model("Article", articleSchema);