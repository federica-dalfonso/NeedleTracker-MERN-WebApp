import { Router } from "express";
import { config } from "dotenv";
import User from "../models/user.schema.js";
import Article from "../models/article.schema.js";
import { validateNewArticle, validateUpdatedArticle } from "../middlewares/validateArticle.js";
import coverUpload from "../middlewares/uploadFiles/uploadArticle.js";

export const articlesRoute = Router();

//GET singolo articolo dell'autore:
articlesRoute.get("/articles/:authorId/single/:articleId", async (req, res, next) => {
    try {
        const author = await User.findById(req.params.authorId);

        if(author) {
            const singleArticle = await Article.findById(req.params.articleId);

            if(singleArticle) {
                //controllo che l'articolo appartenga all'autore:
                if(singleArticle._author.toString() === req.params.authorId) {
                    res.status(200).send(singleArticle)   
                } else {
                    //se non appartiene all'autore:
                    res.status(404).send({error: "This article does not belong to the specified author" })
                }                
            } else {
                //se l'articolo non esiste:
                const error = new Error("article not found");
                error.status = 404;
                next(error);
            }
        } else {
            //se l'autore non esiste
            const error = new Error("author not found");
            error.status = 404;
            next(error);
        }
    } catch (error) {
        next(error)
    }
})

//GET tutti gli articoli dell'autore:
articlesRoute.get("/articles/:authorId/all", async (req, res, next) => {
    try {
        const author = await User.findById(req.params.authorId);

        if (author) {
            const articleOf = await Article.find({
                _author: author._id
            });
            res.status(200).send(articleOf);

        } else {
            //se l'autore non esiste
            const error = new Error("author not found");
            error.status = 404;
            next(error);
        }

    } catch (error) {
        next(error);
    }
})

// PUT article 
articlesRoute.put("/article/:articleId", validateUpdatedArticle, async (req, res, next) => {
    try {
        const article = await Article.findById(req.params.articleId);

        if (article) {
            //solo l'autore dell'articolo può modificare, quindi:
            if(article._author.toString() === req.user._id.toString()) {
              const updatedArticle = await Article.findByIdAndUpdate(req.params.articleId, req.body,
                { new: true }
                );
                res.status(200).send(updatedArticle);  
            } else {                
                const error = new Error("Not authorized to modify this article!");
                error.status = 403;
                next(error);
            };

        } else {
            const error = new Error("article not found");
            error.status = 404;
            next(error);
        }
        
    } catch (error) {
        next(error);
    }
})

//POST article
articlesRoute.post("/articles", validateNewArticle, async (req, res, next) => {
    try {
        const article = await Article.create({
            ...req.body,
            _author: req.user._id
        });

        //aggiungo l'articolo all'autore:
        const author = await User.findById(req.user._id);
        author._articles.push(article._id);
        await author.save();

        res.status(201).send(article);

    } catch (error) {
        next(error);
    }
})

// DELETE article
articlesRoute.delete("/article/:articleId", async (req, res, next) => {
    try {
        const article = await Article.findById(req.params.articleId);

        if(article) {

            if(article._author.toString() === req.user._id.toString()) {
                //rimuovo l'id del post dall'array _articles dell'autore:
                const author = await User.findById(article._author);
                author._articles.pull(req.params.articleId);
                await author.save();

                await Article.findByIdAndDelete(req.params.articleId);
                res.sendStatus(204);
                
            } else {
                const error = new Error("Not authorized to delete this article!");
                error.status = 403;
                next(error);
            }         
        } else {
            const error = new Error("article not found");
            error.status = 404;
            next(error);
        }
        
    } catch (error) {
        next(error);
    }
})

//POST upload cover:
articlesRoute.post("/article/cover", coverUpload, async (req, res, next) => {
    try {
        const coverUrl = req.file.path;

        if (coverUrl) {
            res.status(200).json({ coverUrl });
        } else {
            res.status(500).send("An error occurred in uploading file!");
        }
    } catch (error) {
        next(error);
    }
})

//PATCH immagine articolo: 
articlesRoute.patch("/article/:articleId/cover", coverUpload, async (req, res, next) => {
    try {
        const article = await Article.findById(req.params.articleId);

        if(article) {
            if(article._author.toString() === req.user._id.toString()) {
                const updatedArticle = await Article.findByIdAndUpdate(
                req.params.articleId, 
                //percorso del file caricato (URL img su Cloudinary):
                { cover: req.file.path}, 
                { new: true });
    
                res.send(updatedArticle);

            } else {
                const error = new Error("Not authorized to modify article's cover!");
                error.status = 403;
                next(error);
            }

        } else {
            const error = new Error("article not found");
            error.status = 404;
            next(error);
        }
    } catch (error) {
        next(error);
    }
})

