"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        version: '2.0.0',
        message: 'MediLogs API TypeScript está funcionando correctamente'
    });
});
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'API de prueba funcionando',
        data: {
            timestamp: new Date().toISOString(),
            version: '2.0.0'
        }
    });
});
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Ruta no encontrada',
        availableRoutes: {
            health: '/health',
            test: '/api/test'
        }
    });
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor MediLogs TypeScript corriendo en puerto ${PORT}`);
    console.log(`📊 Health check disponible en: http://localhost:${PORT}/health`);
    console.log(`🧪 API de prueba: http://localhost:${PORT}/api/test`);
});
exports.default = app;
//# sourceMappingURL=app-simple.js.map