const errorHandler = (err, req, res, next) => {
    console.error(err); // Logs the actual error for debugging

    // Preserve original error status code or default to 500
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // Handle specific error codes
    if (err.code === 11000) {
        message = "Duplicate key error (e.g., unique email already exists)";
        statusCode = 400;
    } else if (err.code === "P2025") {
        message = "Record not found";
        statusCode = 404;
    } else if (err.code === 50) {
        message = "Request timeout";
        statusCode = 408;
    } else if (err.code === 13) {
        message = "Unauthorized access";
        statusCode = 403;
    }

    // Send JSON response to frontend
    res.status(statusCode).json({
        success: false,
        message
    });
};

export default errorHandler;
