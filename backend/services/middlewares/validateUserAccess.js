//validazione req.body regsitrazione collector:
export const validateNewCollector = (req, res, next) => {

    const { name, surname, username, email, password, avatar, city, state } = req.body;

    const errors = [];

    if(!name || typeof name !== "string") {
        errors.push({ 
            field: "name" ,
            message : "field is required and the datatype must be 'string'"
        });
    };

    if(!surname || typeof surname !== "string") {
        errors.push({ 
            field: "surname" ,
            message : "field is required and the datatype must be 'string'"
        }); 
    }; 

    if(typeof username !== "string") {
        errors.push({ 
            field: "username" ,
            message : "datatype must be 'string'"
        });
    };

    if(!email || typeof email !== "string") {
        errors.push({ 
            field: "email" ,
            message : "field is required and the datatype must be 'string'"
        });
    };

    if(!password || typeof password !== "string" || password.length < 8){
        errors.push({ 
            field: "password" ,
            message : "field is required, the datatype must be 'string' and it must be at least 8 char long"
        });
    };

    if(!avatar || typeof avatar !== "string") {
        errors.push({ 
            field: "avatar" ,
            message : "field is required and the datatype must be an URL 'string'"
        });
    };

    if(!city || typeof city !== "string") {
        errors.push({ 
            field: "city" ,
            message : "field is required and the datatype must be 'string'"
        });
    };

    if(!state || typeof state !== "string") {
        errors.push({ 
            field: "state" ,
            message : "field is required and the datatype must be 'string'"
        });
    };

    if(errors.length > 0) {

        const err = new Error("Missing fields or invalid datatype");
        err.status = 400;
        err.errors = errors;
        next(err);
        
    } else {

        next();
    }
}

//validazione req.body modifica informazioni collector:
export const validateModifyCollector = (req, res, next) => {
    const { name, surname, username, email, avatar, city, state } = req.body;

    const errors = [];

    if(name && typeof name !== "string") {
        errors.push({ 
            field: "name" ,
            message : "datatype must be 'string'"
        });
    };

    if(surname && typeof surname !== "string") {
        errors.push({ 
            field: "surname" ,
            message : "datatype must be 'string'"
        }); 
    }; 

    if(username && typeof username !== "string") {
        errors.push({ 
            field: "username" ,
            message : "datatype must be 'string'"
        });
    };

    if(email && typeof email !== "string") {
        errors.push({ 
            field: "email" ,
            message : "datatype must be 'string'"
        });
    };

    if(avatar && typeof avatar !== "string") {
        errors.push({ 
            field: "avatar" ,
            message : "datatype must be an URL 'string'"
        });
    };

    if(city && typeof city !== "string") {
        errors.push({ 
            field: "city" ,
            message : "datatype must be 'string'"
        });
    };

    if(state && typeof state !== "string") {
        errors.push({ 
            field: "state" ,
            message : "datatype must be 'string'"
        });
    };

    if(errors.length > 0) {

        const err = new Error("Missing fields or invalid datatype");
        err.status = 400;
        err.errors = errors;
        next(err);
        
    } else {

        next();
    }
}

//validazione req.body login collector/author:
export const validateLogin = (req, res, next) => {
    
    const { email, password } = req.body;
    const errors = [];

    if(!email || typeof email !== "string") {
        errors.push({ 
            field: "email",
            message : "field is required and the datatype must be 'string'"
        });
    };

    if(!password || typeof password !== "string" || password.length < 8) {
        errors.push({ 
            field: "password" ,
            message : "field is required, the datatype must be 'string' and it must be at least 8 char long"
        })
    };
    
    if(errors.length > 0) {

        const err = new Error("Missing fields or invalid datatype");
        err.status = 400;
        err.errors = errors;
        next(err);
        
    } else {

        next();
    }

}

//validazione req.body regsitrazione author:
export const validateNewAuthor = (req, res, next) => {

    const { name, surname, email, role, avatar } = req.body;

    const errors = [];

    if(!name || typeof name !== "string") {
        errors.push({ 
            field: "name",
            message : "field is required and the datatype must be 'string'"
        });
    };

    if(!surname || typeof surname !== "string") {
       errors.push({ 
            field: "surname",
            message : "field is required and the datatype must be 'string'"
        }) 
    }; 

    if(!email || typeof email !== "string") {
        errors.push({ 
            field: "email",
            message : "field is required and the datatype must be 'string'"
        })
    };

    if(avatar && typeof avatar !== "string") {
        errors.push({ 
            field: "avatar" ,
            message : "field is required and the datatype must be an URL 'string'"
        });
    };

    if(!role || typeof role !== "string" || role !== "author") {
        errors.push({ 
            field: "role",
            message: "field is required, datatype must be 'string' and it must be 'author' to register the user in this area!"
        })
    };

    if(errors.length > 0) {

        const err = new Error("Missing fields or invalid datatype");
        err.status = 400;
        err.errors = errors;
        next(err);
        
    } else {
        next();
    }
}

//validazione body PUT: 
export const validateModifyAuthor = (req, res, next) => {

    const { name, surname, username, email, avatar } = req.body;

    const errors = [];

    if(name && typeof name !== "string") {
        errors.push({
            field: "name", 
            message : "datatype must be 'string'"
        });
    };

    if(surname && typeof surname !== "string") {
       errors.push({ 
            field: "surname", 
            message : "datatype must be 'string'"        
        }) 
    }; 

    if(username && typeof username !== "string") {
        errors.push({ 
            field: "username", 
            message : "datatype must be 'string'" 
        })
    };

    if(email && typeof email !== "string") {
        errors.push({ 
            field: "email", 
            message : "datatype must be 'string'"
        })
    };

    if(avatar && typeof avatar !== "string") {
        errors.push({ 
            field: "avatar", 
            message : "datatype must be URL 'string'"
        })
    };

    if(errors.length > 0) {

        const err = new Error("Invalid datatype");
        err.status = 400;
        err.errors = errors;
        next(err);
        
    } else {

        next();
    }
    
}