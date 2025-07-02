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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv = __importStar(require("dotenv"));
const database_1 = require("./config/database");
const pacientes_1 = __importDefault(require("./routes/pacientes"));
const consultas_1 = __importDefault(require("./routes/consultas"));
dotenv.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});
app.get('/health', async (req, res) => {
    const dbStatus = await (0, database_1.testConnection)();
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'medilogs2-api',
        database: dbStatus ? 'connected' : 'disconnected',
        version: '2.0.0'
    });
});
app.get('/api', (req, res) => {
    res.json({
        message: 'MediLogs2 API - Sistema de Gestión Médica con PostgreSQL',
        version: '2.0.0',
        database: 'PostgreSQL',
        endpoints: {
            health: '/health',
            pacientes: '/api/pacientes',
            consultas: '/api/consultas'
        },
        documentation: 'Ver README-TypeScript.md y POSTMAN-GUIDE.md para más detalles'
    });
});
app.use('/api/pacientes', pacientes_1.default);
app.use('/api/consultas', consultas_1.default);
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint no encontrado',
        availableEndpoints: [
            'GET /health',
            'GET /api',
            'GET /api/pacientes',
            'POST /api/pacientes',
            'GET /api/pacientes/:id',
            'PUT /api/pacientes/:id',
            'DELETE /api/pacientes/:id',
            'GET /api/consultas',
            'POST /api/consultas',
            'GET /api/consultas/:id',
            'GET /api/pacientes/:pacienteId/consultas',
            'PUT /api/consultas/:id',
            'PATCH /api/consultas/:id/estado',
            'DELETE /api/consultas/:id'
        ]
    });
});
app.use((error, req, res, next) => {
    console.error('Error global:', error);
    res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
    });
});
const PORT = process.env.PORT || 3001;
async function startServer() {
    try {
        console.log('🔍 Probando conexión a PostgreSQL...');
        const dbConnected = await (0, database_1.testConnection)();
        if (!dbConnected) {
            console.error('❌ No se pudo conectar a PostgreSQL. Verifica tu configuración en .env');
            console.log('📋 Configuración requerida:');
            console.log('   DB_HOST=localhost');
            console.log('   DB_PORT=5432');
            console.log('   DB_NAME=medilogs2');
            console.log('   DB_USER=postgres');
            console.log('   DB_PASSWORD=tu_password');
            console.log('\n💡 Para configurar PostgreSQL:');
            console.log('   1. Instala PostgreSQL');
            console.log('   2. Crea la base de datos: CREATE DATABASE medilogs2;');
            console.log('   3. Ejecuta el script: psql -d medilogs2 -f database/schema.sql');
            console.log('   4. Actualiza las credenciales en .env');
            process.exit(1);
        }
        app.listen(PORT, () => {
            console.log(`\n🚀 MediLogs2 API con PostgreSQL corriendo en puerto ${PORT}`);
            console.log(`📋 Health check: http://localhost:${PORT}/health`);
            console.log(`🏥 API Info: http://localhost:${PORT}/api`);
            console.log(`👥 Pacientes: http://localhost:${PORT}/api/pacientes`);
            console.log(`📅 Consultas: http://localhost:${PORT}/api/consultas`);
            console.log(`\n🎯 LISTO PARA POSTMAN:`);
            console.log(`   Base URL: http://localhost:${PORT}`);
            console.log(`   Consulta POSTMAN-GUIDE.md para ejemplos completos\n`);
        });
    }
    catch (error) {
        console.error('❌ Error iniciando el servidor:', error);
        process.exit(1);
    }
}
process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM recibido, cerrando servidor...');
    process.exit(0);
});
process.on('SIGINT', () => {
    console.log('🛑 SIGINT recibido, cerrando servidor...');
    process.exit(0);
});
startServer();
exports.default = app;
//# sourceMappingURL=app-database.js.map