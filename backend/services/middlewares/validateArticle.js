//validazione req.body nuovo articolo:
export const validateNewArticle = (req, res, next) => {

    const { category, title, cover, resume, content, _author } = req.body;

    const errors = [];

    if(!category || typeof category !== "string") {
        errors.push({ 
            field: "category" ,
            message : "field is required and the datatype must be 'string'"
        });
    };

    if(!title || typeof title !== "string") {
        errors.push({ 
            field: "title",
            message : "field is required and the datatype must be 'string'"
        });
    };

    if(!cover || typeof cover !== "string") {
        errors.push({ 
            field: "cover",
            message : "field is required and the datatype must be an URL 'string'"
        });
    };

    if(!resume || typeof resume !== "string") {
        errors.push({ 
            field: "resume",
            message : "field is required and the datatype must be 'string'"
        });
    };

    if(!content || typeof content !== "string") {
        errors.push({ 
            field: "content",
            message : "field is required and the datatype must be 'string'"
        });
    };

    if(!_author || typeof _author !== "string") {
        errors.push({ 
            field: "_author",
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

//validazione req.body modifica articolo:
export const validateUpdatedArticle = (req, res, next) => {

    const { category, title, cover, resume, content } = req.body;

    const errors = [];

    if(category && typeof category !== "string") {
        errors.push({ 
            field: "category",
            message : "datatype must be 'string'"
        });
    };

    if(title && typeof title !== "string") {
        errors.push({ 
            field: "title",
            message : "datatype must be 'string'"
        });
    };

    if(cover && typeof cover !== "string") {
        errors.push({ 
            field: "cover",
            message : "datatype must be URL 'string'"
        });
    };

    if(resume && typeof resume !== "string") {
        errors.push({ 
            field: "resume",
            message : "datatype must be 'string'"
        });
    };

    if(content && typeof content !== "string") {
        errors.push({ 
            field: "content",
            message : "datatype must be 'string'"
        });
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