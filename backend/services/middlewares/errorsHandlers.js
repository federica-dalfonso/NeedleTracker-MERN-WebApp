export const badRequestHandler = (err, req, res, next) => {

    if ( err.status === 400 ) {
        res.status(400).send({
            success: false,
            message: err.message,
            errorList: err.errors,
        })
    } else {
        next(err)
    }
}

export const unauthorizedHandler = (err, req, res, next) => {

    if (err.status === 401) {
      res.status(401).send({
        success: false,
        message: err.message,
        errorList: err.errors,
    })
    } else {
      next(err)
    }
}

export const forbiddenAccessHandler = (err, req, res, next) => {

    if(err.status === 403) {
        res.status(403).send({
            success: false,
            message: err.message,
            errorList: err.errors,
        })
    } else {
        next(err)
    }
}

export const notFoundHandler = (err, req, res, next) => {

    if (err.status === 404) {
      res.status(404).send({
        success: false,
        message: err.message,
        errorList: err.errors,
    })
    } else {
      next(err)
    }
}

export const invalidFIleError = (err, req, res, next) => {
    if (err.code === "INVALID_FILE_TYPE") {
        res.status(400).send({
            success: false,
            message: err.message,
            errorList: err.errors,
        });
    } else {
        next(err);
    }
}

export const genericErrorHandler = (err, req, res, next) => {
    res.status(500).send({
        message: err.message,
    })
}
  