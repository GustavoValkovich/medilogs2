"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simpleRequestLogger = exports.requestLogger = void 0;
const logger_1 = require("../utils/logger");
const logger = (0, logger_1.createModuleLogger)('RequestLogger');
const requestLogger = (req, res, next) => {
    const startTime = Date.now();
    const requestInfo = {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
    };
    logger.info(`🔵 Incoming ${req.method} ${req.url}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });
    const originalSend = res.send;
    res.send = function (data) {
        const duration = Date.now() - startTime;
        const responseSize = data ? JSON.stringify(data).length : 0;
        const emoji = res.statusCode >= 400 ? '🔴' : res.statusCode >= 300 ? '🟡' : '🟢';
        logger.info(`${emoji} ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`, {
            statusCode: res.statusCode,
            duration,
            responseSize,
            ip: req.ip
        });
        return originalSend.call(this, data);
    };
    next();
};
exports.requestLogger = requestLogger;
const simpleRequestLogger = (req, res, next) => {
    const startTime = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const emoji = res.statusCode >= 400 ? '🔴' : res.statusCode >= 300 ? '🟡' : '🟢';
        console.log(`${emoji} ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
    });
    next();
};
exports.simpleRequestLogger = simpleRequestLogger;
//# sourceMappingURL=requestLogger.js.map