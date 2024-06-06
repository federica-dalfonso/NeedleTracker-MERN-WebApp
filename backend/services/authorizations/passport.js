import { config } from "dotenv";
import GoogleStrategy from "passport-google-oauth20";
import { generateJWT } from "./jwtconfig.js";
import User from "../models/user.schema.js";
config();

//opzioni OAuth:
const options = {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SEC,
    callbackURL: process.env.CALL_URL
}

//creo googleStrategY:
const googleStrategy = new GoogleStrategy(options, async (_, __, profile, passportNext) => {
    try {
        const { email, given_name, family_name, sub, picture } = profile._json;

        //cerco l'utente:
        const user = await User.findOne({ email });
        //se l'utente esiste già:
        if(user) {
            const accToken = await generateJWT({
                _id: user._id
            });
            passportNext(null, {accToken})
        } else {
            //se l'utente non esiste lo creo:
            const newUser = new User({
                name: given_name,
                surname: family_name,
                email: email, 
                googleId: sub,
                avatar: picture,
                role: "collector"
            });
            await newUser.save();

            const accToken = await generateJWT({
                name: newUser.name,
                email: newUser.email
            });
            passportNext(null, {accToken})

        }

    } catch (error) {
        passportNext(error);
    }
})

export default googleStrategy;