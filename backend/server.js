import { config } from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import passport from "passport";
import googleStrategy from "./services/authorizations/passport.js";
import { accessRoute } from "./services/routes/access.routes.js";
import { userRoute } from "./services/routes/me.route.js";
import { validateRole } from "./services/middlewares/validateRole.js";
import { authorsRoute } from "./services/routes/authors.routes.js";
import { articlesRoute } from "./services/routes/articles.routes.js";
import { freeRoutes } from "./services/routes/free.routes.js";
import { collectorsRoute } from "./services/routes/collectors.routes.js";
import { vinylsRoute } from "./services/routes/vinyls.routes.js";
import { authRedirector } from "./services/middlewares/validateToken.js";
import { badRequestHandler, unauthorizedHandler, forbiddenAccessHandler,
        notFoundHandler, invalidFIleError, genericErrorHandler} from "./services/middlewares/errorsHandlers.js";

//dotenv config:
config();

//definizione porta:
const PORT = process.env.PORT || 3003;

//init di express:
const app = express();

//cors (al momento per tutte le rotte):
app.use(cors());

//uso json:
app.use(express.json());

//googleStrategy:
passport.use("google", googleStrategy);

//rotte libere da autenticazione:
app.use("/blog", freeRoutes);
//registrazione e login collector:
app.use("/access", accessRoute);
//route me:
app.use("/", authRedirector, userRoute);

//rotte RISERVATE autori e gestione blog:
app.use("/adminarea", authRedirector, validateRole(["author"]), authorsRoute);
app.use("/adminarea", authRedirector, validateRole(["author"]), articlesRoute);
//rotte RISERVATE collector e gestione vinili:
app.use("/tracker", authRedirector, validateRole(["collector"]), collectorsRoute);
app.use("/tracker", authRedirector, validateRole(["collector"]), vinylsRoute);

//errori generici:
app.use(badRequestHandler);
app.use(unauthorizedHandler);
app.use(forbiddenAccessHandler);
app.use(notFoundHandler);
app.use(invalidFIleError);
app.use(genericErrorHandler);

//init server:
const initServer = async () => {

    try {
        await mongoose.connect(process.env.MONGO_URL);
        app.listen(PORT, () => {
            console.log(`Server is connected at port: ${PORT}`);
        })
        
    } catch (error) {
        console.error("Connection failed. Error:", error);
    }

};

initServer();