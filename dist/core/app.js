"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const config_1 = require("./config");
const connection_1 = require("../database/connection");
const logger_1 = require("../shared/utils/logger");
const middleware_1 = require("../shared/middleware");
const middleware_2 = require("../shared/middleware");
const modules_1 = require("../modules");
const createApp = () => {
    const app = (0, express_1.default)();
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: config_1.isDevelopment ? false : undefined,
    }));
    app.use((0, cors_1.default)({
        origin: config_1.config.server.corsOrigins,
        credentials: true,
    }));
    if (!config_1.isDevelopment) {
        const limiter = (0, express_rate_limit_1.default)({
            windowMs: 15 * 60 * 1000,
            max: 100,
            message: 'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde.',
        });
        app.use(limiter);
    }
    app.use((0, compression_1.default)());
    app.use(express_1.default.json({ limit: '10mb' }));
    app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
    app.use(middleware_2.requestLogger);
    app.get('/health', async (req, res) => {
        try {
            const dbConnected = await (0, connection_1.testConnection)();
            const healthData = {
                status: dbConnected ? 'OK' : 'ERROR',
                timestamp: new Date().toISOString(),
                service: config_1.config.name,
                version: config_1.config.version,
                environment: config_1.config.server.env,
                database: {
                    type: config_1.config.database.type,
                    connected: dbConnected
                },
                uptime: process.uptime(),
                memory: process.memoryUsage()
            };
            res.status(dbConnected ? 200 : 503).json(healthData);
        }
        catch (error) {
            logger_1.logger.error('Error en health check:', error);
            res.status(503).json({
                status: 'ERROR',
                timestamp: new Date().toISOString(),
                service: config_1.config.name,
                error: 'Health check failed'
            });
        }
    });
    app.get(`${config_1.config.apiPrefix}`, (req, res) => {
        res.json({
            name: config_1.config.name,
            version: config_1.config.version,
            environment: config_1.config.server.env,
            database: config_1.config.database.type,
            endpoints: {
                health: '/health',
                auth: `${config_1.config.apiPrefix}/auth`,
                patients: `${config_1.config.apiPrefix}/patients`,
                doctors: `${config_1.config.apiPrefix}/doctors`,
                consultations: `${config_1.config.apiPrefix}/consultations`,
                pacientes: `${config_1.config.apiPrefix}/pacientes`,
                medicos: `${config_1.config.apiPrefix}/medicos`,
                consultas: `${config_1.config.apiPrefix}/consultas`
            },
            features: [
                '🔒 Seguridad mejorada con Helmet y Rate Limiting',
                '📝 Validación automática de datos',
                '📊 Logging estructurado',
                '🚀 Gestión automática de puertos',
                '💾 Base de datos flexible (PostgreSQL/SQLite)',
                '🧩 Arquitectura modular',
                '⚡ Compresión y optimizaciones'
            ],
            documentation: 'Sistema de gestión médica optimizado - MediLogs2'
        });
    });
    app.use(`${config_1.config.apiPrefix}/auth`, modules_1.authRouter);
    app.use(`${config_1.config.apiPrefix}/patients`, modules_1.patientsRouter);
    app.use(`${config_1.config.apiPrefix}/doctors`, modules_1.doctorsRouter);
    app.use(`${config_1.config.apiPrefix}/consultations`, modules_1.consultationsRouter);
    app.use(`${config_1.config.apiPrefix}/pacientes`, modules_1.patientsRouter);
    app.use(`${config_1.config.apiPrefix}/medicos`, modules_1.doctorsRouter);
    app.use(`${config_1.config.apiPrefix}/consultas`, modules_1.consultationsRouter);
    app.use(middleware_1.notFoundHandler);
    app.use(middleware_1.errorHandler);
    return app;
};
exports.createApp = createApp;
//# sourceMappingURL=app.js.map