import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { testConnection } from './config/database';
import { PacienteController } from './controllers/paciente-db.controller';
import { ConsultaController } from './controllers/consulta-db.controller';
import { MedicoController } from './controllers/medico-db.controller';

// Cargar variables de entorno
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Instanciar controladores
const pacienteController = new PacienteController();
const consultaController = new ConsultaController();
const medicoController = new MedicoController();

// Middleware para logging de requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const dbConnected = await testConnection();
    res.json({ 
      status: dbConnected ? 'OK' : 'ERROR',
      timestamp: new Date().toISOString(),
      service: 'medilogs2-api',
      database: dbConnected ? 'Connected' : 'Disconnected'
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      service: 'medilogs2-api',
      database: 'Error',
      error: 'Database connection failed'
    });
  }
});

// API info endpoint
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

// ==================== RUTAS DE PACIENTES ====================

// GET todos los pacientes (con paginación y búsqueda)
app.get('/api/pacientes', pacienteController.getAllPacientes.bind(pacienteController));

// GET paciente por ID
app.get('/api/pacientes/:id', pacienteController.getPacienteById.bind(pacienteController));

// POST crear paciente
app.post('/api/pacientes', pacienteController.createPaciente.bind(pacienteController));

// PUT actualizar paciente
app.put('/api/pacientes/:id', pacienteController.updatePaciente.bind(pacienteController));

// DELETE paciente
app.delete('/api/pacientes/:id', pacienteController.deletePaciente.bind(pacienteController));

// GET pacientes importantes
app.get('/api/pacientes/especiales/importantes', pacienteController.getPacientesImportantes.bind(pacienteController));

// GET pacientes por médico
app.get('/api/medicos/:medicoId/pacientes', pacienteController.getPacientesByMedico.bind(pacienteController));

// ==================== RUTAS DE CONSULTAS ====================

// GET todas las consultas (con paginación y filtros)
app.get('/api/consultas', consultaController.getAllConsultas.bind(consultaController));

// GET consulta por ID
app.get('/api/consultas/:id', consultaController.getConsultaById.bind(consultaController));

// POST crear consulta
app.post('/api/consultas', consultaController.createConsulta.bind(consultaController));

// PUT actualizar consulta
app.put('/api/consultas/:id', consultaController.updateConsulta.bind(consultaController));

// DELETE consulta
app.delete('/api/consultas/:id', consultaController.deleteConsulta.bind(consultaController));

// GET consultas de un paciente específico
app.get('/api/pacientes/:pacienteId/consultas', consultaController.getConsultasByPaciente.bind(consultaController));

// GET últimas consultas
app.get('/api/consultas/especiales/ultimas', consultaController.getUltimasConsultas.bind(consultaController));

// GET buscar consultas
app.get('/api/consultas/especiales/buscar', consultaController.searchConsultas.bind(consultaController));

// ==================== RUTAS DE MÉDICOS ====================

// GET todos los médicos
app.get('/api/medicos', medicoController.getAllMedicos.bind(medicoController));

// GET médico por ID
app.get('/api/medicos/:id', medicoController.getMedicoById.bind(medicoController));

// POST crear médico
app.post('/api/medicos', medicoController.createMedico.bind(medicoController));

// PUT actualizar médico
app.put('/api/medicos/:id', medicoController.updateMedico.bind(medicoController));

// DELETE médico
app.delete('/api/medicos/:id', medicoController.deleteMedico.bind(medicoController));

// ==================== RUTAS DE AUTENTICACIÓN ====================

// POST login
app.post('/api/auth/login', medicoController.login.bind(medicoController));

// ==================== MANEJO DE ERRORES ====================

// Endpoint no encontrado
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

// Middleware global de manejo de errores
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error global:', error);
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor'
  });
});

// Función para iniciar el servidor
async function startServer() {
  const PORT = process.env.PORT || 3001;

  try {
    // Probar conexión a la base de datos antes de iniciar
    console.log('🔗 Probando conexión a PostgreSQL...');
    const dbConnected = await testConnection();
    
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
  } catch (error) {
    console.error('❌ Error iniciando el servidor:', error);
    process.exit(1);
  }
}

// Manejo de señales para cerrar la aplicación gracefully
process.on('SIGINT', () => {
  console.log('\n👋 Cerrando servidor...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Cerrando servidor...');
  process.exit(0);
});

// Iniciar servidor
startServer();

export default app;
