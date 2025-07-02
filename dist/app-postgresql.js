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
const paciente_db_controller_1 = require("./controllers/paciente-db.controller");
const consulta_db_controller_1 = require("./controllers/consulta-db.controller");
const medico_db_controller_1 = require("./controllers/medico-db.controller");
dotenv.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const pacienteController = new paciente_db_controller_1.PacienteController();
const consultaController = new consulta_db_controller_1.ConsultaController();
const medicoController = new medico_db_controller_1.MedicoController();
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});
app.get('/health', async (req, res) => {
    try {
        const dbConnected = await (0, database_1.testConnection)();
        res.json({
            status: dbConnected ? 'OK' : 'ERROR',
            timestamp: new Date().toISOString(),
            service: 'medilogs2-api',
            database: dbConnected ? 'Connected' : 'Disconnected'
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'ERROR',
            timestamp: new Date().toISOString(),
            service: 'medilogs2-api',
            database: 'Error',
            error: 'Database connection failed'
        });
    }
});
app.get('/api', (req, res) => {
    res.json({
        message: 'MediLogs2 API - Sistema de Gestión Médica con PostgreSQL',
        version: '2.0.0',
        database: 'PostgreSQL',
        endpoints: {
            pacientes: '/api/pacientes',
            consultas: '/api/consultas',
            medicos: '/api/medicos',
            auth: '/api/auth/login',
            health: '/health'
        },
        documentation: 'Conectado a PostgreSQL con estructura existente'
    });
});
app.get('/api/pacientes', pacienteController.getAllPacientes.bind(pacienteController));
app.get('/api/pacientes/:id', pacienteController.getPacienteById.bind(pacienteController));
app.post('/api/pacientes', pacienteController.createPaciente.bind(pacienteController));
app.put('/api/pacientes/:id', pacienteController.updatePaciente.bind(pacienteController));
app.delete('/api/pacientes/:id', pacienteController.deletePaciente.bind(pacienteController));
app.get('/api/pacientes/especiales/importantes', pacienteController.getPacientesImportantes.bind(pacienteController));
app.get('/api/medicos/:medicoId/pacientes', pacienteController.getPacientesByMedico.bind(pacienteController));
app.get('/api/consultas', consultaController.getAllConsultas.bind(consultaController));
app.get('/api/consultas/:id', consultaController.getConsultaById.bind(consultaController));
app.post('/api/consultas', consultaController.createConsulta.bind(consultaController));
app.put('/api/consultas/:id', consultaController.updateConsulta.bind(consultaController));
app.delete('/api/consultas/:id', consultaController.deleteConsulta.bind(consultaController));
app.get('/api/pacientes/:pacienteId/consultas', consultaController.getConsultasByPaciente.bind(consultaController));
app.get('/api/consultas/especiales/ultimas', consultaController.getUltimasConsultas.bind(consultaController));
app.get('/api/consultas/especiales/buscar', consultaController.searchConsultas.bind(consultaController));
app.get('/api/medicos', medicoController.getAllMedicos.bind(medicoController));
app.get('/api/medicos/:id', medicoController.getMedicoById.bind(medicoController));
app.post('/api/medicos', medicoController.createMedico.bind(medicoController));
app.put('/api/medicos/:id', medicoController.updateMedico.bind(medicoController));
app.delete('/api/medicos/:id', medicoController.deleteMedico.bind(medicoController));
app.post('/api/auth/login', medicoController.login.bind(medicoController));
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
            'PUT /api/consultas/:id',
            'DELETE /api/consultas/:id',
            'GET /api/pacientes/:pacienteId/consultas',
            'GET /api/medicos',
            'POST /api/medicos',
            'GET /api/medicos/:id',
            'PUT /api/medicos/:id',
            'DELETE /api/medicos/:id',
            'POST /api/auth/login'
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
async function startServer() {
    const PORT = process.env.PORT || 3001;
    try {
        console.log('🔗 Probando conexión a PostgreSQL...');
        const dbConnected = await (0, database_1.testConnection)();
        if (!dbConnected) {
            console.error('❌ No se pudo conectar a la base de datos. Verifique la configuración.');
            process.exit(1);
        }
        app.listen(PORT, () => {
            console.log(`\n🚀 MediLogs2 API con PostgreSQL corriendo en puerto ${PORT}`);
            console.log(`📋 Health check: http://localhost:${PORT}/health`);
            console.log(`🏥 API Info: http://localhost:${PORT}/api`);
            console.log(`\n📊 ENDPOINTS PRINCIPALES:`);
            console.log(`👥 Pacientes:`);
            console.log(`   GET    http://localhost:${PORT}/api/pacientes`);
            console.log(`   POST   http://localhost:${PORT}/api/pacientes`);
            console.log(`   GET    http://localhost:${PORT}/api/pacientes/:id`);
            console.log(`   PUT    http://localhost:${PORT}/api/pacientes/:id`);
            console.log(`   DELETE http://localhost:${PORT}/api/pacientes/:id`);
            console.log(`\n📅 Consultas:`);
            console.log(`   GET    http://localhost:${PORT}/api/consultas`);
            console.log(`   POST   http://localhost:${PORT}/api/consultas`);
            console.log(`   GET    http://localhost:${PORT}/api/consultas/:id`);
            console.log(`   PUT    http://localhost:${PORT}/api/consultas/:id`);
            console.log(`   DELETE http://localhost:${PORT}/api/consultas/:id`);
            console.log(`   GET    http://localhost:${PORT}/api/pacientes/:pacienteId/consultas`);
            console.log(`\n👨‍⚕️ Médicos:`);
            console.log(`   GET    http://localhost:${PORT}/api/medicos`);
            console.log(`   POST   http://localhost:${PORT}/api/medicos`);
            console.log(`   GET    http://localhost:${PORT}/api/medicos/:id`);
            console.log(`   PUT    http://localhost:${PORT}/api/medicos/:id`);
            console.log(`   DELETE http://localhost:${PORT}/api/medicos/:id`);
            console.log(`\n🔐 Autenticación:`);
            console.log(`   POST   http://localhost:${PORT}/api/auth/login`);
            console.log(`\n🎯 Base de datos: PostgreSQL (${process.env.DB_NAME})`);
            console.log(`📖 ¡API lista para usar con Postman!\n`);
        });
    }
    catch (error) {
        console.error('❌ Error iniciando el servidor:', error);
        process.exit(1);
    }
}
process.on('SIGINT', () => {
    console.log('\n👋 Cerrando servidor...');
    process.exit(0);
});
process.on('SIGTERM', () => {
    console.log('\n👋 Cerrando servidor...');
    process.exit(0);
});
startServer();
exports.default = app;
//# sourceMappingURL=app-postgresql.js.map