import { Router } from "express";
import { config } from "dotenv";
import User from "../models/user.schema.js";
import Article from "../models/article.schema.js";

export const freeRoutes = Router();

//tutti gli articoli
freeRoutes.get("/articles", async (req, res, next) => {
    try {
        const articles = await Article.find()
        .sort({ createdAt: 1, updatedAt: 1})
        .populate("_author");

        res.status(200).send(articles);
        
    } catch (error) {        
        next(error)

    }
})

//singolo articolo:
freeRoutes.get("/article/:articleId", async (req, res, next) => {
    try {
        let article = await Article.findById(req.params.articleId).populate("_author");

        if(article) {

            res.status(200).send(article);
            
        } else {
            const err = new Error("article not found!");
            err.status = 404;
            throw err;
        }
    } catch (error) {
        next(error);
    }
})