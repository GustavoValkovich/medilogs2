"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const pacientes_1 = __importDefault(require("./routes/pacientes"));
const consultas_1 = __importDefault(require("./routes/consultas"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'medilogs2-api',
        version: '1.0.0'
    });
});
app.get('/api', (req, res) => {
    res.json({
        message: 'MediLogs2 API - Sistema de Gestión Médica',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            pacientes: '/api/pacientes',
            consultas: '/api/consultas'
        },
        documentation: 'Ver README-TypeScript.md para más detalles'
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
            'GET /api/consultas',
            'POST /api/consultas'
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
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`\n🚀 Servidor MediLogs2 corriendo en puerto ${PORT}`);
    console.log(`📋 Health check: http://localhost:${PORT}/health`);
    console.log(`🏥 API Info: http://localhost:${PORT}/api`);
    console.log(`👥 Pacientes: http://localhost:${PORT}/api/pacientes`);
    console.log(`📅 Consultas: http://localhost:${PORT}/api/consultas`);
    console.log(`\n📖 Para usar con Postman, importa las siguientes URLs:`);
    console.log(`   GET  http://localhost:${PORT}/api/pacientes`);
    console.log(`   POST http://localhost:${PORT}/api/pacientes`);
    console.log(`   GET  http://localhost:${PORT}/api/consultas`);
    console.log(`   POST http://localhost:${PORT}/api/consultas\n`);
});
exports.default = app;
//# sourceMappingURL=app-postman.js.map