import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { config, isDevelopment } from './config';
import { testConnection } from '../database/connection';
import { logger } from '../shared/utils/logger';
import { errorHandler, notFoundHandler } from '../shared/middleware';
import { requestLogger } from '../shared/middleware';
import { patientsRouter, doctorsRouter, consultationsRouter, authRouter, filesRouter } from '../modules';

/**
 * Crear y configurar la aplicación Express
 */
export const createApp = (): express.Application => {
  const app = express();
  
  // ==================== MIDDLEWARE DE SEGURIDAD ====================
  
  // Helmet para headers de seguridad
  app.use(helmet({
    contentSecurityPolicy: isDevelopment ? false : undefined,
  }));
  
  // CORS configurado
  app.use(cors({
    origin: config.server.corsOrigins,
    credentials: true,
  }));
  
  // Rate limiting
  if (!isDevelopment) {
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 100, // máximo 100 requests por ventana
      message: 'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde.',
    });
    app.use(limiter);
  }
  
  // ==================== MIDDLEWARE DE PARSING ====================
  
  // Compresión
  app.use(compression());
  
  // Body parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  
  // ==================== ARCHIVOS ESTÁTICOS ====================
  
  // Servir archivos de uploads
  const uploadsPath = path.join(__dirname, '../../uploads');
  app.use('/uploads', express.static(uploadsPath));
  
  // ==================== MIDDLEWARE DE LOGGING ====================
  
  app.use(requestLogger);
  
  // ==================== HEALTH CHECKS ====================
  
  app.get('/health', async (req, res) => {
    try {
      const dbConnected = await testConnection();
      const healthData = {
        status: dbConnected ? 'OK' : 'ERROR',
        timestamp: new Date().toISOString(),
        service: config.name,
        version: config.version,
        environment: config.server.env,
        database: {
          type: config.database.type,
          connected: dbConnected
        },
        uptime: process.uptime(),
        memory: process.memoryUsage()
      };
      
      res.status(dbConnected ? 200 : 503).json(healthData);
    } catch (error) {
      logger.error('Error en health check:', error);
      res.status(503).json({
        status: 'ERROR',
        timestamp: new Date().toISOString(),
        service: config.name,
        error: 'Health check failed'
      });
    }
  });
  
  // Endpoint de información
  app.get(`${config.apiPrefix}`, (req, res) => {
    res.json({
      name: config.name,
      version: config.version,
      environment: config.server.env,
      database: config.database.type,
      endpoints: {
        health: '/health',
        // Nuevas rutas modulares
        auth: `${config.apiPrefix}/auth`,
        patients: `${config.apiPrefix}/patients`,
        doctors: `${config.apiPrefix}/doctors`,
        consultations: `${config.apiPrefix}/consultations`,
        files: `${config.apiPrefix}/files`,
        uploads: '/uploads',
        // Rutas legacy (compatibilidad)
        pacientes: `${config.apiPrefix}/pacientes`,
        medicos: `${config.apiPrefix}/medicos`,
        consultas: `${config.apiPrefix}/consultas`
      },
      features: [
        '🔒 Seguridad mejorada con Helmet y Rate Limiting',
        '📝 Validación automática de datos',
        '📊 Logging estructurado',
        '🚀 Gestión automática de puertos',
        '💾 Base de datos flexible (PostgreSQL/SQLite)',
        '🧩 Arquitectura modular',
        '⚡ Compresión y optimizaciones',
        '📁 Upload de archivos (JPG, PNG, PDF) <1MB'
      ],
      documentation: 'Sistema de gestión médica optimizado - MediLogs2'
    });
  });
  
  // ==================== RUTAS MODULARES ====================
  
  // Rutas de autenticación
  app.use(`${config.apiPrefix}/auth`, authRouter);
  
  // Rutas de pacientes  
  app.use(`${config.apiPrefix}/patients`, patientsRouter);
  
  // Rutas de médicos
  app.use(`${config.apiPrefix}/doctors`, doctorsRouter);
  
  // Rutas de consultas
  app.use(`${config.apiPrefix}/consultations`, consultationsRouter);
  
  // Rutas de archivos
  app.use(`${config.apiPrefix}/files`, filesRouter);
  
  // ==================== RUTAS DE COMPATIBILIDAD ====================
  // Mantener rutas legacy para compatibilidad con Postman existente
  
  app.use(`${config.apiPrefix}/pacientes`, patientsRouter);
  app.use(`${config.apiPrefix}/medicos`, doctorsRouter);
  app.use(`${config.apiPrefix}/consultas`, consultationsRouter);
  
  // ==================== MIDDLEWARE DE MANEJO DE ERRORES ====================
  
  app.use(notFoundHandler);
  app.use(errorHandler);
  
  return app;
};
