import { Pool } from 'pg';
import { Database, open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { config } from '../core/config';
import { logger } from '../shared/utils/logger';
import path from 'path';

export interface QueryResult {
  rows: any[];
  rowCount: number;
}

export interface DatabaseConnection {
  query: (text: string, params?: any[]) => Promise<QueryResult>;
  testConnection: () => Promise<boolean>;
  close: () => Promise<void>;
  type: 'postgresql' | 'sqlite';
}

class PostgreSQLConnection implements DatabaseConnection {
  private pool: Pool;
  public readonly type = 'postgresql';
  
  constructor() {
    this.pool = new Pool({
      user: config.database.user,
      password: config.database.password,
      host: config.database.host,
      port: config.database.port,
      database: config.database.database,
      max: config.database.maxConnections,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: config.database.connectionTimeout,
    });
    
    this.pool.on('connect', () => {
      logger.debug('✅ Nueva conexión PostgreSQL establecida');
    });
    
    this.pool.on('error', (err) => {
      logger.error('❌ Error inesperado en PostgreSQL:', err);
    });
  }
  
  async query(text: string, params?: any[]): Promise<QueryResult> {
    const start = Date.now();
    try {
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;
      
      logger.query(text, duration, result.rowCount || 0);
      
      return {
        rows: result.rows,
        rowCount: result.rowCount || 0
      };
    } catch (error) {
      const duration = Date.now() - start;
      logger.error(`❌ Error en query (${duration}ms):`, { text, error });
      throw error;
    }
  }
  
  async testConnection(): Promise<boolean> {
    try {
      const client = await this.pool.connect();
      const result = await client.query('SELECT NOW()');
      client.release();
      logger.info('🔗 Conexión PostgreSQL exitosa:', result.rows[0].now);
      return true;
    } catch (error) {
      logger.error('❌ Error conectando a PostgreSQL:', error);
      return false;
    }
  }
  
  async close(): Promise<void> {
    await this.pool.end();
    logger.info('🔒 Pool de conexiones PostgreSQL cerrado');
  }
}

class SQLiteConnection implements DatabaseConnection {
  private db: Database | null = null;
  public readonly type = 'sqlite';
  
  async init(): Promise<void> {
    if (this.db) return;
    
    const dbPath = path.join(__dirname, '../../database/medilogs2.sqlite');
    
    this.db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    
    await this.createTables();
    logger.info('✅ SQLite database inicializada:', dbPath);
  }
  
  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    // Tabla pacientes adaptada a la estructura existente
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS paciente (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        medico_id INTEGER,
        nombre TEXT,
        documento TEXT,
        nacimiento DATE,
        importante TEXT,
        sexo TEXT,
        obra_social TEXT,
        mail TEXT
      )
    `);
    
    // Tabla consultas adaptada
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS consulta (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        paciente_id INTEGER,
        fecha_historia DATETIME,
        historia TEXT,
        imagen TEXT
      )
    `);
    
    // Tabla medicos adaptada
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS medico (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      )
    `);
    
    logger.debug('📋 Tablas SQLite creadas/verificadas');
  }
  
  async query(text: string, params?: any[]): Promise<QueryResult> {
    if (!this.db) {
      await this.init();
    }
    
    const start = Date.now();
    try {
      let result: any;
      
      if (text.trim().toUpperCase().startsWith('SELECT')) {
        result = await this.db!.all(text, params);
        return {
          rows: result,
          rowCount: result.length
        };
      } else if (text.trim().toUpperCase().startsWith('INSERT')) {
        const insertResult = await this.db!.run(text, params);
        
        if (insertResult.lastID) {
          // Para mantener compatibilidad con PostgreSQL, devolver el registro insertado
          const tableName = text.match(/INSERT INTO (\w+)/)?.[1];
          if (tableName) {
            const selectResult = await this.db!.get(`SELECT * FROM ${tableName} WHERE id = ?`, [insertResult.lastID]);
            return {
              rows: [selectResult],
              rowCount: 1
            };
          }
        }
        
        return {
          rows: [],
          rowCount: insertResult.changes || 0
        };
      } else {
        const updateResult = await this.db!.run(text, params);
        return {
          rows: [],
          rowCount: updateResult.changes || 0
        };
      }
    } catch (error) {
      const duration = Date.now() - start;
      logger.error(`❌ Error en SQLite query (${duration}ms):`, { text, error });
      throw error;
    }
  }
  
  async testConnection(): Promise<boolean> {
    try {
      await this.init();
      await this.query('SELECT 1');
      logger.info('🔗 Conexión SQLite exitosa');
      return true;
    } catch (error) {
      logger.error('❌ Error conectando a SQLite:', error);
      return false;
    }
  }
  
  async close(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.db = null;
      logger.info('🔒 Base de datos SQLite cerrada');
    }
  }
}

// Factory para crear la conexión apropiada
export const createDatabaseConnection = async (): Promise<DatabaseConnection> => {
  if (config.database.type === 'postgresql') {
    const pgConnection = new PostgreSQLConnection();
    
    // Verificar si PostgreSQL está disponible
    const isAvailable = await pgConnection.testConnection();
    
    if (isAvailable) {
      return pgConnection;
    } else {
      logger.warn('⚠️  PostgreSQL no disponible, cambiando a SQLite...');
      await pgConnection.close();
    }
  }
  
  // Fallback a SQLite
  const sqliteConnection = new SQLiteConnection();
  await sqliteConnection.init();
  return sqliteConnection;
};

// Instancia global de la conexión
let dbConnection: DatabaseConnection | null = null;

export const getDatabase = async (): Promise<DatabaseConnection> => {
  if (!dbConnection) {
    dbConnection = await createDatabaseConnection();
  }
  return dbConnection;
};

export const closeDatabase = async (): Promise<void> => {
  if (dbConnection) {
    await dbConnection.close();
    dbConnection = null;
  }
};

// Función de conveniencia para queries
export const query = async (text: string, params?: any[]): Promise<QueryResult> => {
  const db = await getDatabase();
  return db.query(text, params);
};

// Función de conveniencia para test de conexión
export const testConnection = async (): Promise<boolean> => {
  const db = await getDatabase();
  return db.testConnection();
};
