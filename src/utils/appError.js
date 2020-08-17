class AppError extends Error {
    constructor(data = undefined, statusCode = 500) {
        let message = "Unknown error occurred";
        let errorCode;
        if(data) {
            if(data.errorCode) {
                errorCode = data.errorCode;
                delete data.errorCode;
            }
            if(data.message) {
                message = data.message;
                delete data.message;
            } else {
                message = data;
                data = undefined
            }
        }
        if(!data || Object.keys(data).length <= 0) {
            data = undefined;
        }
        
        super(message);
        this.errorCode = errorCode;
        this.data = data;
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = AppError;