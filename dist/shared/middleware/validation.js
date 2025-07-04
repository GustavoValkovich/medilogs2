"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeInput = exports.commonSchemas = exports.validateParams = exports.validateQuery = exports.validateBody = void 0;
const errorHandler_1 = require("./errorHandler");
const validateBody = (schema) => {
    return (req, res, next) => {
        try {
            const errors = validateObject(req.body, schema);
            if (errors.length > 0) {
                throw (0, errorHandler_1.createError)(`Errores de validación: ${errors.join(', ')}`, 400);
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.validateBody = validateBody;
const validateQuery = (schema) => {
    return (req, res, next) => {
        try {
            const errors = validateObject(req.query, schema);
            if (errors.length > 0) {
                throw (0, errorHandler_1.createError)(`Errores en parámetros de consulta: ${errors.join(', ')}`, 400);
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.validateQuery = validateQuery;
const validateParams = (schema) => {
    return (req, res, next) => {
        try {
            const errors = validateObject(req.params, schema);
            if (errors.length > 0) {
                throw (0, errorHandler_1.createError)(`Errores en parámetros de ruta: ${errors.join(', ')}`, 400);
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.validateParams = validateParams;
function validateObject(obj, schema) {
    const errors = [];
    for (const [field, rules] of Object.entries(schema)) {
        const value = obj[field];
        if (rules.required && (value === undefined || value === null || value === '')) {
            errors.push(`El campo '${field}' es requerido`);
            continue;
        }
        if (!rules.required && (value === undefined || value === null || value === '')) {
            continue;
        }
        if (rules.type && typeof value !== rules.type) {
            errors.push(`El campo '${field}' debe ser de tipo ${rules.type}`);
            continue;
        }
        if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
            errors.push(`El campo '${field}' debe tener al menos ${rules.minLength} caracteres`);
        }
        if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
            errors.push(`El campo '${field}' no puede tener más de ${rules.maxLength} caracteres`);
        }
        if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
            errors.push(`El campo '${field}' no tiene el formato correcto`);
        }
        if (rules.values && !rules.values.includes(value)) {
            errors.push(`El campo '${field}' debe ser uno de: ${rules.values.join(', ')}`);
        }
    }
    return errors;
}
exports.commonSchemas = {
    id: {
        id: { required: true, type: 'string', pattern: /^\d+$/ }
    },
    pagination: {
        page: { required: false, type: 'string', pattern: /^\d+$/ },
        limit: { required: false, type: 'string', pattern: /^\d+$/ }
    },
    email: {
        email: {
            required: true,
            type: 'string',
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        }
    }
};
const sanitizeInput = (req, res, next) => {
    if (req.body && typeof req.body === 'object') {
        req.body = sanitizeObject(req.body);
    }
    if (req.query && typeof req.query === 'object') {
        req.query = sanitizeObject(req.query);
    }
    next();
};
exports.sanitizeInput = sanitizeInput;
function sanitizeObject(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
            sanitized[key] = value
                .trim()
                .replace(/[<>]/g, '')
                .replace(/javascript:/gi, '')
                .replace(/on\w+=/gi, '');
        }
        else if (typeof value === 'object') {
            sanitized[key] = sanitizeObject(value);
        }
        else {
            sanitized[key] = value;
        }
    }
    return sanitized;
}
//# sourceMappingURL=validation.js.map