import net from 'net';
import { config, validateConfig, isDevelopment } from './config';
import { logger } from '../shared/utils/logger';

export interface ServerInstance {
  port: number;
  close: () => Promise<void>;
}

/**
 * Verificar si un puerto está disponible
 */
export const isPortAvailable = (port: number): Promise<boolean> => {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.listen(port, () => {
      server.once('close', () => resolve(true));
      server.close();
    });
    
    server.on('error', () => resolve(false));
  });
};

/**
 * Encontrar un puerto disponible
 */
export const findAvailablePort = async (startPort: number = config.server.startPort): Promise<number> => {
  let port = startPort;
  let retries = 0;
  
  while (retries < config.server.maxPortRetries) {
    if (await isPortAvailable(port)) {
      return port;
    }
    
    port++;
    retries++;
    
    logger.debug(`Puerto ${port - 1} ocupado, probando ${port}...`);
  }
  
  throw new Error(`No se pudo encontrar un puerto disponible después de ${config.server.maxPortRetries} intentos`);
};

/**
 * Terminar procesos que usan un puerto específico
 */
export const killProcessOnPort = async (port: number): Promise<boolean> => {
  try {
    const { exec } = require('child_process');
    const command = process.platform === 'win32' 
      ? `netstat -ano | findstr :${port}`
      : `lsof -ti:${port}`;
    
    return new Promise((resolve) => {
      exec(command, (error: any, stdout: string) => {
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
          
          exec(killCommand, (killError: any) => {
            if (!killError) {
              logger.info(`🔄 Proceso en puerto ${port} terminado (PID: ${pid})`);
            }
            resolve(!killError);
          });
        } else {
          resolve(false);
        }
      });
    });
  } catch (error) {
    logger.error('Error terminando proceso:', error);
    return false;
  }
};

/**
 * Iniciar servidor con gestión inteligente de puertos
 */
export const startServer = async (app: any): Promise<ServerInstance> => {
  // Validar configuración
  validateConfig();
  
  let port = config.server.port;
  
  // En desarrollo, intentar liberar el puerto si está ocupado
  if (isDevelopment && !(await isPortAvailable(port))) {
    logger.warn(`⚠️  Puerto ${port} está ocupado`);
    
    // Intentar liberar el puerto
    const killed = await killProcessOnPort(port);
    
    if (!killed || !(await isPortAvailable(port))) {
      logger.info('🔍 Buscando puerto alternativo...');
      port = await findAvailablePort(port);
    }
  } else if (!(await isPortAvailable(port))) {
    // En producción, buscar puerto alternativo
    port = await findAvailablePort(port);
  }
  
  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      logger.info(`🚀 ${config.name} v${config.version} iniciado`);
      logger.info(`📡 Servidor corriendo en puerto ${port}`);
      logger.info(`🌍 Entorno: ${config.server.env}`);
      logger.info(`💾 Base de datos: ${config.database.type}`);
      logger.info(`📋 Health check: http://localhost:${port}/health`);
      logger.info(`🏥 API: http://localhost:${port}${config.apiPrefix}`);
      
      if (isDevelopment) {
        logger.info(`\n📊 ENDPOINTS PRINCIPALES:`);
        logger.info(`👥 Pacientes: http://localhost:${port}${config.apiPrefix}/pacientes`);
        logger.info(`📅 Consultas: http://localhost:${port}${config.apiPrefix}/consultas`);
        logger.info(`👨‍⚕️ Médicos: http://localhost:${port}${config.apiPrefix}/medicos`);
        logger.info(`🔐 Auth: http://localhost:${port}${config.apiPrefix}/auth/login`);
      }
      
      const serverInstance: ServerInstance = {
        port,
        close: () => {
          return new Promise<void>((resolveClose) => {
            server.close(() => {
              logger.info('👋 Servidor cerrado correctamente');
              resolveClose();
            });
          });
        }
      };
      
      resolve(serverInstance);
    });
    
    server.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        logger.error(`❌ Puerto ${port} ya está en uso`);
        findAvailablePort(port + 1)
          .then(newPort => {
            logger.info(`🔄 Reintentando en puerto ${newPort}...`);
            // Recursive call with new port
            config.server.port = newPort;
            startServer(app).then(resolve).catch(reject);
          })
          .catch(reject);
      } else {
        reject(error);
      }
    });
  });
};

/**
 * Configurar cierre graceful del servidor
 */
export const setupGracefulShutdown = (serverInstance: ServerInstance): void => {
  const shutdown = async (signal: string) => {
    logger.info(`\n🛑 ${signal} recibido, cerrando servidor...`);
    
    try {
      await serverInstance.close();
      process.exit(0);
    } catch (error) {
      logger.error('❌ Error cerrando servidor:', error);
      process.exit(1);
    }
  };
  
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGUSR2', () => shutdown('SIGUSR2')); // Nodemon
  
  // Manejar errores no capturados
  process.on('uncaughtException', (error) => {
    logger.error('❌ Excepción no capturada:', error);
    process.exit(1);
  });
  
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('❌ Promise rechazada no manejada:', reason);
    process.exit(1);
  });
};
