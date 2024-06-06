import jwt from "jsonwebtoken";
import { config } from "dotenv";
import User from "../models/user.schema.js";

export const verifyJWT = (token) => {

    return new Promise((resp, rejc) =>
        jwt.verify(token, process.env.JWT_SECRET,

            (error, decoded) => {
                if(error) {
                    rejc(error)
                } else {
                    resp(decoded)
                }
            }
        ) 
    
    )
};

export const authRedirector = async (req, res, next) => {

    try {
        //controlla che ci sia l'autorizzazione nella req.headers, se NON c'è:
        if(!req.headers["authorization"]) {
            res.status(401).send("You have to log in to view this page! Please log in to continue.")

        } else {
            //se c'è controlla che sia di tipo bearer:
            const authHeader = req.headers["Authorization"] || req.headers["authorization"];
            if(!authHeader.startsWith("Bearer ")) {

                res.status(401).send("Invalid token. Token must be a Bearer token!");

            } else {
                //se il token è bearer, prosegui:

                const decoded = await verifyJWT(
                //togli il 'bearer' dal dato per verificarlo
                req.headers["authorization"].replace('Bearer ', '')
                ); 

                if(decoded.exp) {
                    delete decoded.iat 
                    delete decoded.exp

                    const me = await User.findOne({
                        ...decoded,
                    });

                    if(me) {
                        req.user = me
                        next();

                    } else {
                        res.status(401).send("User unauthorized")
                    }
                } else {
                res.status(401).send("Token expired, please log in again!")
                }
            }              
        }
        
    } catch (error) {
        next(error)
    }
};