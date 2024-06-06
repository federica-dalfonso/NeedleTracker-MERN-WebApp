import { Router } from "express";
import { config } from "dotenv";
import User from "../models/user.schema.js";

export const userRoute = Router();

userRoute.get("/me", async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select("-_articles -_vinyls -city -state");
        if(user) {
            res.status(200).send(user)

        } else {
            const error = new Error("user not found");
            error.status = 404;
            next(error);
        }
    } catch (error) {
        next(error);
        console.log(error)
    }        
})