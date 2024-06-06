import { Router } from "express";
import bcrypt from "bcryptjs";
import passport from "passport";
import { config } from "dotenv";
import User from "../models/user.schema.js";
import { generateJWT } from "../authorizations/jwtconfig.js";
import { validateNewCollector, validateLogin } from "../middlewares/validateUserAccess.js";
import avatarUpload from "../middlewares/uploadFiles/uploadUsers.js";

export const accessRoute = Router();

accessRoute.post("/signin", validateNewCollector, async (req, res, next) => {
    try {

        //verifica l'unicità della email fornita:
        const { email } = req.body;
        const existingMail = await User.findOne({ email });

        //se l'email esiste:
        if(existingMail) {
            const error = new Error("Email is already in use, please enter another one!");
            error.status = 400;
            next(error);

        } else {
            //altrimenti crea un nuovo utente:
            const newUser = await User.create({
                ...req.body,
                password: await bcrypt.hash(req.body.password, 12)
            });
            const newUserCollector = await User.findById(newUser._id).select("-_articles");
            res.status(201).send(newUserCollector);            
        }    
        
    } catch (error) {
        next(error);
    }

    }
);

accessRoute.post("/login", validateLogin, async (req, res, next) => {
    try {
        //cerca l'utente per email:
        const userFound = await User.findOne({
            email: req.body.email,
        }).select("+password");

        //se c'è confronto psw fornita e psw in db:
        if(userFound) {
            const matchPsw = await bcrypt.compare(req.body.password, userFound.password);

            //se corrispondono genero il token:
            if(matchPsw) {
                const token = await generateJWT({
                    surname: userFound.surname,
                    email: userFound.email,
                    role: userFound.role
                });

                //se il ruolo dell'utente è author, escludo la lista vinili dalla response:
                if(userFound.role === "author") {
                    const userWithoutVinyls = await User.findById(userFound._id).select("-_vinyls");
                    res.send({ user: userWithoutVinyls, token});
                
                } else if(userFound.role === "collector") {
                    //se invece è collector, escludo la lista articoli dalla response:
                    const userWithoutArticle = await User.findById(userFound._id).select("-_articles");
                    res.send({ user: userWithoutArticle, token});
                };

            } else {
                //se le psw non corrispondono:
                const error = new Error("Password is incorrecy, try again!");
                error.status = 400;
                next(error);
            }
        } else {
            //se l'utente non è registrato:
            const error = new Error("You need to register to access the service. Please, signin!");
            error.status = 401;
            next(error);
        }
    } catch (error) {

        next(error);
        
    }
})

//upload avatar
accessRoute.post("/avatar", avatarUpload, async (req, res, next) => {
    try {
        const avatarUrl = req.file.path;

        if (avatarUrl) {
            res.status(200).json({ avatarUrl });
        } else {
            const error = new Error("An error occurred in uploading file!");
            error.status = 500;
            next(error);
        }

    } catch (error) {
        next(error);
    }
})

//google login:
accessRoute.get("/googleLogin", passport.authenticate("google", {scope: ["profile", "email"] }));

accessRoute.get("/callback", passport.authenticate("google", {session: false}), (req, res, next) => {
    try {
        res.redirect(`${process.env.FRONTEND_URL}welcome?accessToken=${req.user.accToken}`);
    } catch (error) {
        next(error);
    }
})