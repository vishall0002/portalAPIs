export const sendResponse = (res, statusCode, errorCode, errorMessage, result = []) => {
    return res.status(statusCode).json({
        Error: {
            ErrorCode: errorCode,
            ErrorMessage: errorMessage
        },
        Result: result
    });
};
