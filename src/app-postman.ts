import express from 'express';
import cors from 'cors';
import pacientesRoutes from './routes/pacientes';
import consultasRoutes from './routes/consultas';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para logging de requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'medilogs2-api',
    version: '1.0.0'
  });
});

// Endpoints de información
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

// Rutas principales
app.use('/api/pacientes', pacientesRoutes);
app.use('/api/consultas', consultasRoutes);

// Ruta para manejar endpoints no encontrados
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

// Middleware global de manejo de errores
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
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

export default app;
