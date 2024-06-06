import { Schema, model } from "mongoose";

const userSchema = new Schema({

    name: {
        type: String, 
        required: true
    }, 

    surname: {
        type: String, 
        required: true
    },

    username: {
        type: String,
        required: false
    },

    email: {
        type: String, 
        required: true,
        unique: true
    }, 

    password: {
        type: String, 
        required: false,
        select: false
    },

    googleId: {
        type: String,
        required: false
    }, 

    avatar: {
        type: String,
        required: false
    },

    role: {
        type: String,
        enum: ["collector", "author"],
        default: "collector"
    },

    city: {
        type: String, 
        required: false
    },

    state: {
        type: String, 
        required: false
    },

    _articles: [
        {
            type: Schema.Types.ObjectId,
            ref: "Article"
        }
    ],

    _vinyls : [
        {
            type: Schema.Types.ObjectId,
            ref: "Vinyl"
        }
    ],

    _wishlist : [
        {
            type: Schema.Types.ObjectId,
            ref: "Wish"
        }
    ]

    }, 

    {   
        timestamps: true,
        collection: "users"
    }

);

export default model("User", userSchema);