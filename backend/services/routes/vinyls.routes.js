import { Router } from "express";
import { config } from "dotenv";
import User from "../models/user.schema.js";
import Vinyl from "../models/vinyl.schema.js";
import Wish from "../models/wishlist.schema.js";
import { validateNewVinyl, validateUpdatedVinyl } from "../middlewares/validateVinyl.js";
import photosUpload from "../middlewares/uploadFiles/uploadVinyls.js";

export const vinylsRoute = Router();

//QUERY RICERCA: 
vinylsRoute.get("/vinyls/search", async (req, res, next) => {
    try {
        const { title, artist, genre, yearOfRel } = req.query;

        let search = { isPublic : true }; 
        
        
        if (title) search.title = { $regex: title, $options: 'i' };
        if (artist) search.artist = { $regex: artist, $options: 'i' };
        if (genre) search.genre = { $regex: genre, $options: 'i' };
        if (yearOfRel) search.yearOfRel = Number(yearOfRel);

        const vinyls = await Vinyl.find(search);
        if (!vinyls) {
            res.status(200).send([])
        } else {
            res.status(200).send(vinyls);
        } 

    } catch (error) {
        next(error);
    }
})

//GET ALL PUBLIC vinyls:
vinylsRoute.get("/vinyls", async (req, res, next) => {
    try {
        const allPublic = await Vinyl.find({ isPublic: true }).sort({ createdAt: 1, updatedAt: 1})
        .populate({
            path: '_user',
            select: '-_articles -_vinyls',
        })
        .select("-isPublic");
        res.status(200).send(allPublic);
    } catch (error) {
        next(error);
    }
})

//GET SINGLE vinyl:
vinylsRoute.get("/vinyl/:vinylId", async (req, res, next) => {
    try {
        const singlePublic = await Vinyl.findById(req.params.vinylId)
        .populate({
            path: '_user',
            select: '-_articles -_vinyls',
        });

        if(!singlePublic) {
            //se il vinile non esiste:
            const error = new Error("vinyl not found");
            error.status = 404;
            next(error);

        } else {
            //se il vinile esiste ma non è pubblico:
            if(!singlePublic.isPublic) {
                
                if (singlePublic._user[0]._id.toString() ===  req.user._id.toString()) {
                    res.status(200).send(singlePublic);

                } else {
                    const error = new Error("Access forbidden. This vinyl is private!");
                    error.status = 403;
                    next(error);}
            } else {
                res.status(200).send(singlePublic);
            }
        }
    } catch (error) {
        next(error);
    }
})

//GET ALL di tutti i vinili di un singolo user, solo l'user proprietario può accedervi:
vinylsRoute.get("/:collectorId/vinyls", async (req, res, next) => {
    try {
        const collector = await User.findById(req.params.collectorId);

        if (collector) {

            const allVinyls = await Vinyl.find({ _user: req.params.collectorId });

            const isOwner = allVinyls.every(vinyl => vinyl._user.toString() === req.params.collectorId);
            if (isOwner) {
                res.status(200).send(allVinyls);
            } else {
                const error = new Error("Access forbidden, you're not the owner of this collection!");
                error.status = 403;
                next(error);
            }

        } else {
            const error = new Error("collector not found");
            error.status = 404;
            next(error);
        }
        
    } catch (error) {
        next(error);
    }
});

//POST nuovo vinile
vinylsRoute.post("/vinyls", validateNewVinyl, async (req, res, next) => {
    try {
        const newVinyl = await Vinyl.create({
            ...req.body,
            _user: req.user._id
        });

        //aggiungo il vinile all'user:
        const collector = await User.findById(req.user._id);
        collector._vinyls.push(newVinyl._id);
        await collector.save();

        res.status(201).send(newVinyl);
    } catch (error) {
        next(error)
    }
})

//POST upload photos: 
vinylsRoute.post("/vinyl/photos", photosUpload, async (req, res, next) => {
    try {
        //per ogni file:
        const photosUrls = req.files.map(file => file.path);

        if(photosUrls.length > 0) {
            res.status(200).json({ photosUrls });
        } else {
            res.status(500).send("An error occurred in uploading file!");
        }

    } catch (error) {
        next(error);
        console.log(error)
    }
})

//PUT singolo vinile: 
vinylsRoute.put("/vinyl/:vinylId", validateUpdatedVinyl, async (req, res, next) => {
    try {
        const vinyl = await Vinyl.findById(req.params.vinylId);

        if (vinyl) {
            //controllo che il vinile appartenga all'user:
            if(vinyl._user.toString() === req.user._id.toString()) {
              const updatedVinyl = await Vinyl.findByIdAndUpdate(req.params.vinylId, req.body,
                { new: true }
                );
                res.status(200).send(updatedVinyl);  
            } else {
                const error = new Error("Access forbidden. You can't modify this vinyl!");
                error.status = 403;
                next(error);
            };

        } else {
            const error = new Error("vinyl not found");
            error.status = 404;
            next(error);
        }
    } catch (error) {
        next(error);
    }
});

//PATCH singolo vinile: 
vinylsRoute.patch("/vinyl/:vinylId", validateUpdatedVinyl, async (req, res, next) => {
    try {
        const vinyl = await Vinyl.findById(req.params.vinylId);

        if(!vinyl) {
            const error = new Error("vinyl not found");
            error.status = 404;
            next(error);

        } else {

            if (vinyl._user.toString() !== req.user._id.toString()) {
                const error = new Error("Access forbidden. You can't modify this vinyl!");
                error.status = 403;
                next(error);
            
            } else {
                Object.keys(req.body).forEach(key => {
                    vinyl[key] = req.body[key];
                });
        
                const updatedVinyl = await vinyl.save();
                res.status(200).send(updatedVinyl);
            }
        }
    } catch (error) {
        next(error)
    }
})

//PATCH delle immagini:
vinylsRoute.patch("/vinyl/:vinylId/photos", photosUpload, async (req, res, next) => {
    try {
        const vinyl = await Vinyl.findById(req.params.vinylId);
        if(vinyl) {

            if(vinyl._user.toString() === req.user._id.toString()) {
                // Aggiorna solo le foto del vinile
                vinyl.photos = req.files.map(file => file.path);
                await vinyl.save();
                res.status(200).send(vinyl);
            } else {
                const error = new Error("Access forbidden. You can't modify this vinyl!");
                error.status = 403;
                next(error);
            }
        } else {
            const error = new Error("vinyl not found");
            error.status = 404;
            next(error);
        }
    } catch (error) {
        next(error);
    }
});

//DELETE singolo vinile del singolo collector:
vinylsRoute.delete("/vinyl/:vinylId", async (req, res, next) => {
    try {
        const vinyl = await Vinyl.findById(req.params.vinylId);

        if(vinyl) {

            if(vinyl._user.toString() === req.user._id.toString()) {

                //rimuovo l'id del vinile dall'array _vinyls del collector:
                const collector = await User.findById(vinyl._user);
                collector._vinyls.pull(req.params.vinylId);
                await collector.save();

                await Vinyl.findByIdAndDelete(req.params.vinylId);
                res.sendStatus(204);
                
            } else {
                const error = new Error("Access forbidden. You can't delete this vinyl!");
                error.status = 403;
                next(error);
            }         
        } else {
            const error = new Error("vinyl not found");
            error.status = 404;
            next(error);
        }        
    } catch (error) {
        next(error)
    }
})

//DELETE intera collezione di vinili del singolo user:
vinylsRoute.delete("/vinyls/:collectorId", async (req, res, next) => {
    try {
        const collector = await User.findById(req.params.collectorId);

        if(collector) {
            //controllo che l'Id del collector corrisponda a quello proprietario della collezione:
            if(collector._id.toString() === req.user._id.toString()) {
                //rimuovo tutti i vinili del collector:
                for(let vinylId of collector._vinyls) {
                    await Vinyl.findByIdAndDelete(vinylId)
                }

                //svuoto l'array di vinils del collector:
                collector._vinyls = [];
                await collector.save();

                res.sendStatus(204);
            } else {
                const error = new Error("Access forbidden. You can't delete this vinyls list!");
                error.status = 403;
                next(error);
            }
        } else {
            const error = new Error("collector not found");
            error.status = 404;
            next(error);
        }
    } catch (error) {
        next(error)
    }
})

//get wishlist: 
vinylsRoute.get("/wishlist/:collectorId/vinylsId", async (req, res, next) =>  {
    try {
        const collectorId = req.params.collectorId;

        const wishList = await Wish.find({ _wishOf: collectorId })
            .select("-_wishOf")
            .sort({ createdAt: 1, updatedAt: 1 });

        res.status(200).send(wishList);
    } catch (error) {
        next(error);
    }
})

//get wishlist: 
vinylsRoute.get("/wishlist/:collectorId/populate", async (req, res, next) =>  {
    try {
        const collectorId = req.params.collectorId;

        const wishList = await Wish.find({ _wishOf: collectorId })
            .populate("_album")
            .sort({ createdAt: 1, updatedAt: 1 });

        res.status(200).send(wishList);
    } catch (error) {
        next(error);
    }
})

//post wishlist 
vinylsRoute.post("/wishlist/vinyls/:collectorId", async (req, res, next) =>  {
    try {
        const { _album } = req.body;
        const collectorId = req.params.collectorId;

        // se il vinile esiste ed è pubblico
        const vinyl = await Vinyl.findOne({ _id: _album, isPublic: true });

        if (!vinyl) {
            const error = new Error("Vinyl not found or not visible");
            error.status = 404;
            next(error);
        } else {
            //se il vinile è già nella wishlist
            const existingWish = await Wish.findOne({ _album: _album, _wishOf: collectorId });

            if (existingWish) {
                res.status(409).res({ message: "Vinyl is already in your wishlist!" });
                
            } else {
                
                const newWish = await Wish.create({
                    ...req.body,
                    _wishOf: req.user._id
                });

                //aggiungo il wish all'user:
                const collector = await User.findById(req.user._id);
                collector._wishlist.push(newWish._id);
                await collector.save();

                res.status(201).send(newWish);
            }
        }       
    } catch (error) {
        next(error)
    }
});


//delete vinile dalla wishlist:
vinylsRoute.delete("/wishlist/vinyls/:vinylId", async (req, res, next) => {
    try {
        const wish = await Wish.findOne({ _album: req.params.vinylId });
        if (!wish) {
            const error = new Error("Vinyl not found in wishlist");
            error.status = 404;
            next(error);
        } else {
            await Wish.findByIdAndDelete(wish._id);
            await User.updateOne(
                { _id: wish._wishOf },
                { $pull: { _wishlist: wish._id } }
            );    
            res.sendStatus(204);
        }
        
    } catch (error) {
        next(error);
    }
});