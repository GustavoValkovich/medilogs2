"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupGracefulShutdown = exports.startServer = exports.killProcessOnPort = exports.findAvailablePort = exports.isPortAvailable = void 0;
const net_1 = __importDefault(require("net"));
const config_1 = require("./config");
const logger_1 = require("../shared/utils/logger");
const isPortAvailable = (port) => {
    return new Promise((resolve) => {
        const server = net_1.default.createServer();
        server.listen(port, () => {
            server.once('close', () => resolve(true));
            server.close();
        });
        server.on('error', () => resolve(false));
    });
};
exports.isPortAvailable = isPortAvailable;
const findAvailablePort = async (startPort = config_1.config.server.startPort) => {
    let port = startPort;
    let retries = 0;
    while (retries < config_1.config.server.maxPortRetries) {
        if (await (0, exports.isPortAvailable)(port)) {
            return port;
        }
        port++;
        retries++;
        logger_1.logger.debug(`Puerto ${port - 1} ocupado, probando ${port}...`);
    }
    throw new Error(`No se pudo encontrar un puerto disponible después de ${config_1.config.server.maxPortRetries} intentos`);
};
exports.findAvailablePort = findAvailablePort;
const killProcessOnPort = async (port) => {
    try {
        const { exec } = require('child_process');
        const command = process.platform === 'win32'
            ? `netstat -ano | findstr :${port}`
            : `lsof -ti:${port}`;
        return new Promise((resolve) => {
            exec(command, (error, stdout) => {
                if (error || !stdout) {
                    resolve(false);
                    return;
                }
                const pid = process.platform === 'win32'
                    ? stdout.trim().split(/\s+/).pop()
                    : stdout.trim();
                if (pid) {
                    const killCommand = process.platform === 'win32'
                        ? `taskkill /PID ${pid} /F`
                        : `kill -9 ${pid}`;
                    exec(killCommand, (killError) => {
                        if (!killError) {
                            logger_1.logger.info(`🔄 Proceso en puerto ${port} terminado (PID: ${pid})`);
                        }
                        resolve(!killError);
                    });
                }
                else {
                    resolve(false);
                }
            });
        });
    }
    catch (error) {
        logger_1.logger.error('Error terminando proceso:', error);
        return false;
    }
};
exports.killProcessOnPort = killProcessOnPort;
const startServer = async (app) => {
    (0, config_1.validateConfig)();
    let port = config_1.config.server.port;
    if (config_1.isDevelopment && !(await (0, exports.isPortAvailable)(port))) {
        logger_1.logger.warn(`⚠️  Puerto ${port} está ocupado`);
        const killed = await (0, exports.killProcessOnPort)(port);
        if (!killed || !(await (0, exports.isPortAvailable)(port))) {
            logger_1.logger.info('🔍 Buscando puerto alternativo...');
            port = await (0, exports.findAvailablePort)(port);
        }
    }
    else if (!(await (0, exports.isPortAvailable)(port))) {
        port = await (0, exports.findAvailablePort)(port);
    }
    return new Promise((resolve, reject) => {
        const server = app.listen(port, () => {
            logger_1.logger.info(`🚀 ${config_1.config.name} v${config_1.config.version} iniciado`);
            logger_1.logger.info(`📡 Servidor corriendo en puerto ${port}`);
            logger_1.logger.info(`🌍 Entorno: ${config_1.config.server.env}`);
            logger_1.logger.info(`💾 Base de datos: ${config_1.config.database.type}`);
            logger_1.logger.info(`📋 Health check: http://localhost:${port}/health`);
            logger_1.logger.info(`🏥 API: http://localhost:${port}${config_1.config.apiPrefix}`);
            if (config_1.isDevelopment) {
                logger_1.logger.info(`\n📊 ENDPOINTS PRINCIPALES:`);
                logger_1.logger.info(`👥 Pacientes: http://localhost:${port}${config_1.config.apiPrefix}/pacientes`);
                logger_1.logger.info(`📅 Consultas: http://localhost:${port}${config_1.config.apiPrefix}/consultas`);
                logger_1.logger.info(`👨‍⚕️ Médicos: http://localhost:${port}${config_1.config.apiPrefix}/medicos`);
                logger_1.logger.info(`🔐 Auth: http://localhost:${port}${config_1.config.apiPrefix}/auth/login`);
            }
            const serverInstance = {
                port,
                close: () => {
                    return new Promise((resolveClose) => {
                        server.close(() => {
                            logger_1.logger.info('👋 Servidor cerrado correctamente');
                            resolveClose();
                        });
                    });
                }
            };
            resolve(serverInstance);
        });
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                logger_1.logger.error(`❌ Puerto ${port} ya está en uso`);
                (0, exports.findAvailablePort)(port + 1)
                    .then(newPort => {
                    logger_1.logger.info(`🔄 Reintentando en puerto ${newPort}...`);
                    config_1.config.server.port = newPort;
                    (0, exports.startServer)(app).then(resolve).catch(reject);
                })
                    .catch(reject);
            }
            else {
                reject(error);
            }
        });
    });
};
exports.startServer = startServer;
const setupGracefulShutdown = (serverInstance) => {
    const shutdown = async (signal) => {
        logger_1.logger.info(`\n🛑 ${signal} recibido, cerrando servidor...`);
        try {
            await serverInstance.close();
            process.exit(0);
        }
        catch (error) {
            logger_1.logger.error('❌ Error cerrando servidor:', error);
            process.exit(1);
        }
    };
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGUSR2', () => shutdown('SIGUSR2'));
    process.on('uncaughtException', (error) => {
        logger_1.logger.error('❌ Excepción no capturada:', error);
        process.exit(1);
    });
    process.on('unhandledRejection', (reason, promise) => {
        logger_1.logger.error('❌ Promise rechazada no manejada:', reason);
        process.exit(1);
    });
};
exports.setupGracefulShutdown = setupGracefulShutdown;
//# sourceMappingURL=server.js.map