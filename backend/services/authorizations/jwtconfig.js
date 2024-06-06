import jwt from "jsonwebtoken";
import { config } from "dotenv";


export const generateJWT = (payload) => {

    return new Promise ((resp, rejc) => jwt.sign(
        payload, // { userId: user._id, role: user.role } nella body req
        process.env.JWT_SECRET,
        { expiresIn: "8h" },

        (error, token) => {
            if (error) {
                rejc(error)
            } else {
                resp(token)
            }
        }
    ))
};