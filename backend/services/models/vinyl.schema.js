import { Schema, model } from "mongoose";

const vinylSchema = new Schema ({

    title: {
        type: String, 
        required: true
    }, 

    artist : {
        type: String, 
        required: true
    }, 

    format: { 
        type: String,
        required: true
    }, 

    genre: {
        type: String,
        required: true
    },

    countryOfRel: {
        type: String,
        required: false
    }, 

    yearOfRel: {
        type: Number,
        required: true
    }, 

    label: {
        type: String,
        required: false
    }, 

    condition: {
        type: String,
        required: true
    },

    photos: {
        type: [String],
        required: true
    },

    description: {
        type: String, 
        required: true
    },

    isPublic: {
        type: Boolean,
        required: true
    },

    _user: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }                   
    ]
    }, 

    {   
        timestamps: true,
        collection: "vinyls"
    }
)

export default model("Vinyl", vinylSchema);