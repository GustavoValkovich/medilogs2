import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { testConnection } from './config/database';
import pacientesRoutes from './routes/pacientes';
import consultasRoutes from './routes/consultas';

// Cargar variables de entorno
dotenv.config();

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
app.get('/health', async (req, res) => {
  const dbStatus = await testConnection();
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'medilogs2-api',
    database: dbStatus ? 'connected' : 'disconnected',
    version: '2.0.0'
  });
});

// Endpoints de información
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

// Middleware global de manejo de errores
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error global:', error);
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor'
  });
});

const PORT = process.env.PORT || 3001;

// Función para iniciar el servidor
async function startServer() {
  try {
    // Probar conexión a la base de datos
    console.log('🔍 Probando conexión a PostgreSQL...');
    const dbConnected = await testConnection();
    
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

    // Iniciar servidor
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

  } catch (error) {
    console.error('❌ Error iniciando el servidor:', error);
    process.exit(1);
  }
}

// Manejo de señales para cierre graceful
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM recibido, cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT recibido, cerrando servidor...');
  process.exit(0);
});

// Iniciar servidor
startServer();

export default app;
