import { Router } from "express";
import { config } from "dotenv";
import User from "../models/user.schema.js";
import Vinyl from "../models/vinyl.schema.js";
import avatarUpload from "../middlewares/uploadFiles/uploadUsers.js";
import { validateModifyCollector } from "../middlewares/validateUserAccess.js";

export const collectorsRoute = Router();

//GET singolo collezionista:
collectorsRoute.get("/collector/:collectorId", async (req, res, next) => {
    try {
        const collector = await User.findById(req.params.collectorId)
        .select("-_articles")
        .populate({
            path: '_vinyls',
            match: { isPublic: true }, 
            select: '-_user'
        });

        if(collector) {
            res.status(200).send(collector);
        } else {
            const error = new Error("collector not found");
            error.status = 404;
            next(error);
        }        
    } catch (error) {
        next(error);
    }
})

//GET lista collezionisti: 
collectorsRoute.get("/collectors", async (req, res, next) => {
    try {
        const collectors = await User.find({ role: "collector" })
        .sort({email : 1})
        .select("-_articles")
        .populate({
            path: '_vinyls',
            match: { isPublic: true }, 
            select: '-_user'
        });

        res.status(200).send(collectors);

    } catch (error) {
        next(error)
    }
});

//PUT modifica del proprio profilo:
collectorsRoute.put("/collector/:collectorId", validateModifyCollector, async (req, res, next) => {
    try {
        //controlla che l'id dell'utente corrisponda a quello da modificare, confrontando le stringhe:
        if(req.params.collectorId !== req.user._id.toString()) {

            const error = new Error("Not authorized to modify another collector's infos!");
            err.status = 403;
            next(error);

        } else {
            //se l'user cerca di modificare l'email controlla che sia unica:
            if(req.body.email) {
                const collectorPastEmail = await User.findOne({ email: req.body.email });

                if(collectorPastEmail) {                    
                    return res.status(400).send({ error: "This email is already used, please enter another one!" })
                }
            };

            //altrimenti procedi:
            const updatedCollector = await User.findByIdAndUpdate(req.params.collectorId, req.body,
            { new: true});
            
            //se l'autore è stato modificato invia la risposta:
            if(updatedCollector) {
                res.status(200).send(updatedCollector)

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

//DELETE solo del proprio profilo:
collectorsRoute.delete("/collector/:collectorId", async (req, res, next) => {
    try {
        const collector = await User.findById(req.params.collectorId);
    
        if(collector) {
    
            if(req.params.collectorId !== req.user._id.toString()) {
                const error = new Error("Not authorized to delete another collector's profile!");
                err.status = 403;
                next(error);    

            } else {
                await Vinyl.deleteMany({_user : req.params.collectorId});
                await User.findByIdAndDelete({_id: req.params.collectorId});
                res.sendStatus(204);             
            }         
        } else {
            const error = new Error("collector not found");
            err.status = 404;
            next(error);
        }
        
    } catch (error) {
        next(error);
    }    
})

//PATCH della propria immagine profilo: 
collectorsRoute.patch("/collector/:collectorId/avatar", avatarUpload, async(req, res, next) =>{
    try {
        //cerco il collezionista: 
        const collector = await User.findById(req.params.collectorId);

        if(collector) {
            if(req.params.collectorId !== req.user._id.toString()) {

                const error = new Error("Not authorized to modify another collector's profile!");
                err.status = 403;
                next(error); 
    
            } else {
                const updatedCollector = await User.findByIdAndUpdate(
                req.params.collectorId, 
                //percorso del file caricato (URL img su Cloudinary):
                { avatar: req.file.path}, 
                { new: true });

                res.send(updatedCollector);
            }

        } else {
            const error = new Error("collector not found");
            err.status = 404;
            next(error);
        }

    } catch (error) {
        next(err);
    }
})