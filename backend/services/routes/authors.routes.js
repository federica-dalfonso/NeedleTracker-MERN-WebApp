import { Router } from "express";
import { config } from "dotenv";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import User from "../models/user.schema.js";
import Article from "../models/article.schema.js";
import { validateNewAuthor, validateModifyAuthor } from "../middlewares/validateUserAccess.js";
import { generateRandomPSW } from "../middlewares/generatePSW.js";
import avatarUpload from "../middlewares/uploadFiles/uploadUsers.js";

export const authorsRoute = Router();


//GET lista autori
authorsRoute.get("/authors", async (req, res, next) => {
    try {
        const authors = await User.find({ role: "author" }).sort({surname : 1}).select("-_vinyls");
        res.status(200).send(authors);

    } catch (error) {
        next(error);        
    }
});

//GET singolo autore
authorsRoute.get("/author/:authorId", async (req, res, next) => {
    try {
        const author = await User.findById(req.params.authorId).select("-_vinyls");

        if(author) {
            res.status(200).send(author);
        } else {
            const error = new Error("author not found");
            error.status = 404;
            next(error);
        }
        
    } catch (error) {
        next(error);
    }
})

//POST nuovo autore (valido come registrazione):
authorsRoute.post("/authors/new", generateRandomPSW, validateNewAuthor, async (req, res, next) => {
    try {
        //verifica l'unicità dell'email inserita:
        const { email } = req.body;
        const existingMail = await User.findOne({ email });

        if(existingMail) {
            return res.status(400).send({ error: "This email is already used, please enter another one!" })

        } else {
            //se l'email è unica crea il nuovo author:
            const newUser = await User.create({
                ...req.body,
                password: await bcrypt.hash(req.body.password, 12)            
            });
            const newUserAuthor = await User.findById(newUser._id).select("-_vinyls");

            //invia l'email all'author per il login:
            const emailSended = await sendMessage(newUserAuthor, req.body.password);

            if(emailSended) {
                res.status(201).send(newUserAuthor)
            } else {
                const error = new Error("Failed sending email!");
                error.status = 500;
                next(error);
            }                       
        }            
    } catch (error) {
        console.error("Error in /authors/new route:", error);
        next(error)
    }     
})

//configurazione funzione di invio e transporter mail: 
const sendMessage = async (newUserAuthor, password) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            } 
        });
    
        const email = await transporter.sendMail({
            from: '"NeedleTracker Admin Area" <needletracker@ethereal.email>',
            to: newUserAuthor.email,
            subject: "NeedleTracker New Admin Password",
            text: `Hello ${newUserAuthor.name}! Your password to login in NeedleTracker is: ${password}`
        });
        return true;
        
    } catch (error) {
        console.error("Error sending email:", error)
        return false
    }    
}

//PUT author: 
authorsRoute.put("/author/:authorId", validateModifyAuthor, async (req, res, next) => {
    try {
        //controlla che l'id dell'utente corrisponda a quello da modificare, confrontando le stringhe:
        if(req.params.authorId !== req.user._id.toString()) {

            const error = new Error("Not authorized to modify another author's infos!");
            err.status = 403;
            next(error)

        } else {
            //se l'autore cerca di modificare l'email controlliamo che sia unica:
            if(req.body.email) {
                const authorPastEmail = await User.findOne({ email: req.body.email });

                if(authorPastEmail && authorPastEmail._id.toString() !== req.params.authorId) {                    
                    return res.status(400).send({ error: "This email is already used, please enter another one!" })
                }
            };

            //altrimenti procedi:
            const updatedAuthor = await User.findByIdAndUpdate(req.params.authorId, req.body,
            { new: true});
            
            //se l'autore è stato modificato invia la risposta:
            if(updatedAuthor) {
                res.status(200).send(updatedAuthor)

            } else {
                const error = new Error("Something get wrong!");
                error.status = 500;
                next(error);
            }
        }        
    } catch (error) {
        next(error)
    }
})

// DELETE author & i suoi articoli:
authorsRoute.delete("/author/:authorId", async (req, res, next) => {
    try {
        const author = await User.findById(req.params.authorId);

        if (author) {
            //elimino anche gli articoli scritti dall'autore:
            await Article.deleteMany({author : req.params.authorId});
            await User.findByIdAndDelete({_id: req.params.authorId});

            res.sendStatus(204);
        } else {
            const error = new Error("author not found");
            error.status = 404;
            next(error);
        }
        
    } catch (error) {
        next(error);
    }
})