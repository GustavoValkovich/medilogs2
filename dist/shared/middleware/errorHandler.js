"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.createError = exports.asyncHandler = exports.errorHandler = void 0;
const logger_1 = require("../utils/logger");
const logger = (0, logger_1.createModuleLogger)('ErrorHandler');
const errorHandler = (err, req, res, next) => {
    logger.error('Error capturado:', {
        error: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });
    const statusCode = err.statusCode || 500;
    const isOperational = err.isOperational || false;
    const isDevelopment = process.env.NODE_ENV === 'development';
    const errorResponse = {
        success: false,
        message: isOperational ? err.message : 'Error interno del servidor',
        ...(isDevelopment && {
            stack: err.stack,
            details: {
                url: req.url,
                method: req.method,
                timestamp: new Date().toISOString()
            }
        })
    };
    res.status(statusCode).json(errorResponse);
};
exports.errorHandler = errorHandler;
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
const createError = (message, statusCode = 500) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.isOperational = true;
    return error;
};
exports.createError = createError;
const notFoundHandler = (req, res, next) => {
    const error = (0, exports.createError)(`Ruta no encontrada: ${req.originalUrl}`, 404);
    next(error);
};
exports.notFoundHandler = notFoundHandler;
//# sourceMappingURL=errorHandler.js.map