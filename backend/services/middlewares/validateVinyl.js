//validazione req.body nuovo vinile:
export const validateNewVinyl = (req, res, next) => {

    const { title, artist, format, genre, countryOfRel, yearOfRel, label, condition, photos, description, isPublic, _user } = req.body;

    const errors = [];

    if(!title || typeof title !== "string") {
        errors.push({ 
            field: "title" ,
            message : "field is required and the datatype must be 'string'"
        });
    };

    if(!artist || typeof artist !== "string") {
        errors.push({ 
            field: "artist" ,
            message : "field is required and the datatype must be 'string'"
        });
    };

    if(!format || typeof format !== "string") {
        errors.push({ 
            field: "format" ,
            message : "field is required and the datatype must be 'string'"
        });
    };

    if(!genre || typeof genre !== "string") {
        errors.push({ 
            field: "genre" ,
            message : "field is required and the datatype must be 'string'"
        });
    };

    if(!countryOfRel || typeof countryOfRel !== "string") {
        errors.push({ 
            field: "countryOfRel" ,
            message : "field is required and the datatype must be 'string'"
        });
    };

    if(!yearOfRel || typeof yearOfRel !== "number") {
        errors.push({ 
            field: "yearOfRel" ,
            message : "field is required and the datatype must be 'number'"
        });
    };

    if(!label || typeof label !== "string") {
        errors.push({ 
            field: "label" ,
            message : "field is required and the datatype must be 'string'"
        });
    };

    if(!condition || typeof condition !== "string") {
        errors.push({ 
            field: "condition" ,
            message : "field is required and the datatype must be 'string'"
        });
    };

    if(!photos || !Array.isArray(photos) || photos.length === 0) {
        errors.push({ 
            field: "photos" ,
            message : "At least one photo is required and the datatype must be an array of strings"
        });
    };
    
    if(!description || typeof description !== "string") {
        errors.push({ 
            field: "description" ,
            message : "field is required and the datatype must be 'string'"
        });
    };

    if(typeof isPublic !== "boolean") {
        errors.push({ 
            field: "isPublic" ,
            message : "field is required and it must be 'true' or 'false'"
        });
    };

    if(!_user || typeof _user !== "string") {
        errors.push({ 
            field: "_user",
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

//validazione req.body modifica vinile:
export const validateUpdatedVinyl = (req, res, next) => {

    const { title, artist, format, genre, countryOfRel, yearOfRel, label, condition, photos, description, isPublic } = req.body;

    const errors = [];

    if(title && typeof title !== "string") {
        errors.push({ 
            field: "title" ,
            message : "datatype must be 'string'"
        });
    };

    if(artist && typeof artist !== "string") {
        errors.push({ 
            field: "artist" ,
            message : "datatype must be 'string'"
        });
    };

    if(format && typeof format !== "string") {
        errors.push({ 
            field: "format" ,
            message : "datatype must be 'string'"
        });
    };

    if(genre && typeof genre !== "string") {
        errors.push({ 
            field: "genre" ,
            message : "datatype must be 'string'"
        });
    };

    if(countryOfRel && typeof countryOfRel !== "string") {
        errors.push({ 
            field: "countryOfRel" ,
            message : "datatype must be 'string'"
        });
    };

    if(yearOfRel && typeof yearOfRel !== "number") {
        errors.push({ 
            field: "yearOfRel" ,
            message : "datatype must be 'number'"
        });
    };

    if(label && typeof label !== "string") {
        errors.push({ 
            field: "label" ,
            message : "datatype must be 'string'"
        });
    };

    if(condition && typeof condition !== "string") {
        errors.push({ 
            field: "condition" ,
            message : "datatype must be 'string'"
        });
    };

    if(photos && (!Array.isArray(photos) || photos.some(photo => typeof photo !== 'string'))) {
        errors.push({ 
            field: "photos" ,
            message : "datatype must be an array of strings"
        });
    };
    
    if(description && typeof description !== "string") {
        errors.push({ 
            field: "description" ,
            message : "datatype must be 'string'"
        });
    };

    if(typeof isPublic !== "boolean") {
        errors.push({ 
            field: "isPublic" ,
            message : "datatype must be 'true' or 'false'"
        });
    }

    if(errors.length > 0) {

        const err = new Error("Invalid datatype");
        err.status = 400;
        err.errors = errors;
        next(err);
        
    } else {
        next();
    }

}