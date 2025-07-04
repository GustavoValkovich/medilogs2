"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTest = exports.isProduction = exports.isDevelopment = exports.validateConfig = exports.config = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
exports.config = {
    name: 'MediLogs2',
    version: '2.1.0',
    apiPrefix: '/api',
    logLevel: process.env.LOG_LEVEL || 'info',
    database: {
        type: process.env.DB_TYPE || 'postgresql',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'medilogs',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '',
        maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '20'),
        connectionTimeout: parseInt(process.env.DB_TIMEOUT || '2000'),
    },
    server: {
        port: parseInt(process.env.PORT || '3000'),
        startPort: parseInt(process.env.START_PORT || '3000'),
        maxPortRetries: parseInt(process.env.MAX_PORT_RETRIES || '10'),
        env: process.env.NODE_ENV || 'development',
        corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:4000'],
    }
};
const validateConfig = () => {
    const required = ['DB_NAME', 'DB_USER', 'DB_PASSWORD'];
    const missing = required.filter(key => !process.env[key]);
    if (missing.length > 0) {
        console.warn(`⚠️  Variables de entorno faltantes: ${missing.join(', ')}`);
        console.log('📋 Usando valores por defecto para desarrollo');
    }
    if (exports.config.server.env === 'production' && missing.length > 0) {
        throw new Error(`Variables de entorno requeridas en producción: ${missing.join(', ')}`);
    }
};
exports.validateConfig = validateConfig;
exports.isDevelopment = exports.config.server.env === 'development';
exports.isProduction = exports.config.server.env === 'production';
exports.isTest = exports.config.server.env === 'test';
//# sourceMappingURL=config.js.map