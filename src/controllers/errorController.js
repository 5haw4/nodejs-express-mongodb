const AppError = require("../utils/appError")
const { env } = process

const sendDevError = (err, res) => {
    res.status(err.statusCode).json({
        error: true,
        statusCode: err.statusCode,
        status: err.status,
        message: err.message,
        errorCode: err.errorCode,
        data: err.data,
        stack: err.stack,
        err: err
    });
}

const sendProdError = (err, req, res) => {
    //operational error, send message to the client
    if(err.isOperational) {
        res.status(err.statusCode).json({
            error: true,
            statusCode: err.statusCode,
            status: err.status,
            message: err.message,
            errorCode: err.errorCode,
            data: err.data
        });
        
    //programming or other unknown error - preventing leak of info to the client
    } else {
        res.status(500).json({
            error: true,
            statusCode: 500,
            status: "error",
            message: "Something went wrong.",
            errorCode: err.errorCode,
        })
    }
}

const handleCastErrorDB = err => {
    return new AppError(`${err.path} is invalid`, 400)
}
const handleDuplicateFieldsDB = err => {
    let key = Object.keys(err.keyValue)[0];
    key = `${key[0].toUpperCase()}${key.slice(1)}`;
    return new AppError(`${key || "A value that was provided"} already exist`, 400)
}
const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message)
    return new AppError(errors.join("\n"), 400)
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if(env.NODE_ENV === env.ENV_DEV) {
        sendDevError(err, res);
    } else if(env.NODE_ENV === env.ENV_PROD) {
        let error = {...err};
        if(err.name === "CastError") error = handleCastErrorDB(error)
        if(err.name === "ValidationError") error = handleValidationErrorDB(error)
        if(err.code === 11000) error = handleDuplicateFieldsDB(error)

        sendProdError(error, req, res)
    }

}