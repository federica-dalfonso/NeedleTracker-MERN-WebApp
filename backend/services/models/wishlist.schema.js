import { Schema, model } from "mongoose"; 

const wishSchema = new Schema({

    _album : {
        type: Schema.Types.ObjectId,
        ref: "Vinyl",
        required: true
    },

    _wishOf: {
        type: Schema.Types.ObjectId,
        ref: "User", 
    }
    }, 

    {
        timestamps: true,
        collection: "wishlist"
    }

)

export default model("Wish", wishSchema);

