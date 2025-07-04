"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createModuleLogger = exports.logger = void 0;
const config_1 = require("../../core/config");
class Logger {
    constructor(level = 'info') {
        this.logLevel = level;
    }
    shouldLog(level) {
        const levels = ['debug', 'info', 'warn', 'error'];
        return levels.indexOf(level) >= levels.indexOf(this.logLevel);
    }
    formatMessage(level, message, data) {
        const timestamp = new Date().toISOString();
        const emoji = this.getEmoji(level);
        let formattedMessage = `${emoji} [${timestamp}] ${level.toUpperCase()}: ${message}`;
        if (data !== undefined) {
            formattedMessage += ` | Data: ${JSON.stringify(data)}`;
        }
        return formattedMessage;
    }
    getEmoji(level) {
        const emojis = {
            debug: '🔍',
            info: 'ℹ️',
            warn: '⚠️',
            error: '❌'
        };
        return emojis[level];
    }
    log(level, message, data) {
        if (!this.shouldLog(level))
            return;
        const formattedMessage = this.formatMessage(level, message, data);
        if (level === 'error') {
            console.error(formattedMessage);
        }
        else if (level === 'warn') {
            console.warn(formattedMessage);
        }
        else {
            console.log(formattedMessage);
        }
    }
    debug(message, data) {
        this.log('debug', message, data);
    }
    info(message, data) {
        this.log('info', message, data);
    }
    warn(message, data) {
        this.log('warn', message, data);
    }
    error(message, data) {
        this.log('error', message, data);
    }
    performance(operation, duration, data) {
        const level = duration > 1000 ? 'warn' : 'info';
        this.log(level, `⚡ ${operation} completado en ${duration}ms`, data);
    }
    query(sql, duration, rowCount) {
        const truncatedSql = sql.length > 100 ? sql.substring(0, 100) + '...' : sql;
        this.debug(`📊 Query: ${truncatedSql} | Duración: ${duration}ms | Filas: ${rowCount || 0}`);
    }
    request(method, path, statusCode, duration) {
        const emoji = statusCode >= 400 ? '🔴' : statusCode >= 300 ? '🟡' : '🟢';
        this.info(`${emoji} ${method} ${path} - ${statusCode} (${duration}ms)`);
    }
}
exports.logger = new Logger(config_1.config.logLevel);
const createModuleLogger = (moduleName) => {
    return {
        debug: (message, data) => exports.logger.debug(`[${moduleName}] ${message}`, data),
        info: (message, data) => exports.logger.info(`[${moduleName}] ${message}`, data),
        warn: (message, data) => exports.logger.warn(`[${moduleName}] ${message}`, data),
        error: (message, data) => exports.logger.error(`[${moduleName}] ${message}`, data),
    };
};
exports.createModuleLogger = createModuleLogger;
//# sourceMappingURL=logger.js.map