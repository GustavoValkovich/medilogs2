import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  type: 'postgresql' | 'sqlite';
  maxConnections: number;
  connectionTimeout: number;
}

export interface ServerConfig {
  port: number;
  startPort: number;
  maxPortRetries: number;
  env: 'development' | 'production' | 'test';
  corsOrigins: string[];
}

export interface AppConfig {
  name: string;
  version: string;
  apiPrefix: string;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  database: DatabaseConfig;
  server: ServerConfig;
}

// Configuración centralizada
export const config: AppConfig = {
  name: 'MediLogs2',
  version: '2.1.0',
  apiPrefix: '/api',
  logLevel: (process.env.LOG_LEVEL as any) || 'info',
  
  database: {
    type: (process.env.DB_TYPE as any) || 'postgresql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'medilogs',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '20'),
    connectionTimeout: parseInt(process.env.DB_TIMEOUT || '2000'),
  },
  
  server: {
    port: parseInt(process.env.PORT || '3000'),
    startPort: parseInt(process.env.START_PORT || '3000'),
    maxPortRetries: parseInt(process.env.MAX_PORT_RETRIES || '10'),
    env: (process.env.NODE_ENV as any) || 'development',
    corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:4000'],
  }
};

// Validar configuración
export const validateConfig = (): void => {
  const required = ['DB_NAME', 'DB_USER', 'DB_PASSWORD'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.warn(`⚠️  Variables de entorno faltantes: ${missing.join(', ')}`);
    console.log('📋 Usando valores por defecto para desarrollo');
  }
  
  if (config.server.env === 'production' && missing.length > 0) {
    throw new Error(`Variables de entorno requeridas en producción: ${missing.join(', ')}`);
  }
};

// Configuración dinámica según entorno
export const isDevelopment = config.server.env === 'development';
export const isProduction = config.server.env === 'production';
export const isTest = config.server.env === 'test';
