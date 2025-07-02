import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';
import path from 'path';

let db: Database | null = null;

// Configuración de SQLite
export const initSQLiteDatabase = async (): Promise<Database> => {
  if (db) return db;

  const dbPath = path.join(__dirname, '../../database/medilogs2.sqlite');
  
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // Crear tablas si no existen
  await createTables();
  
  console.log('✅ SQLite database initialized:', dbPath);
  return db;
};

// Crear las tablas SQLite
const createTables = async (): Promise<void> => {
  if (!db) throw new Error('Database not initialized');

  // Tabla pacientes
  await db.exec(`
    CREATE TABLE IF NOT EXISTS pacientes (
      id TEXT PRIMARY KEY,
      nombre TEXT NOT NULL,
      apellido TEXT NOT NULL,
      edad INTEGER NOT NULL CHECK (edad >= 0 AND edad <= 150),
      fecha_nacimiento DATE NOT NULL,
      telefono TEXT,
      email TEXT,
      direccion TEXT,
      numero_documento TEXT NOT NULL UNIQUE,
      tipo_documento TEXT NOT NULL CHECK (tipo_documento IN ('DNI', 'PASAPORTE', 'CEDULA', 'OTRO')),
      sexo TEXT NOT NULL CHECK (sexo IN ('MASCULINO', 'FEMENINO', 'OTRO')),
      grupo_sanguineo TEXT CHECK (grupo_sanguineo IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
      alergias TEXT, -- JSON string
      medicamentos_actuales TEXT, -- JSON string  
      enfermedades_cronicas TEXT, -- JSON string
      contacto_emergencia TEXT, -- JSON string
      fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
      activo BOOLEAN DEFAULT TRUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabla consultas
  await db.exec(`
    CREATE TABLE IF NOT EXISTS consultas (
      id TEXT PRIMARY KEY,
      paciente_id TEXT NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
      fecha DATE NOT NULL,
      hora_inicio TEXT NOT NULL,
      hora_fin TEXT,
      motivo TEXT NOT NULL,
      sintomas TEXT, -- JSON string
      signos_vitales TEXT, -- JSON string
      diagnostico TEXT,
      tratamiento TEXT,
      medicamentos_recetados TEXT, -- JSON string
      observaciones TEXT,
      proxima_cita DATE,
      estado TEXT NOT NULL DEFAULT 'PROGRAMADA' 
        CHECK (estado IN ('PROGRAMADA', 'EN_CURSO', 'COMPLETADA', 'CANCELADA', 'NO_ASISTIO')),
      medico TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Índices
  await db.exec(`CREATE INDEX IF NOT EXISTS idx_pacientes_documento ON pacientes(numero_documento)`);
  await db.exec(`CREATE INDEX IF NOT EXISTS idx_pacientes_activo ON pacientes(activo)`);
  await db.exec(`CREATE INDEX IF NOT EXISTS idx_consultas_paciente_id ON consultas(paciente_id)`);
  await db.exec(`CREATE INDEX IF NOT EXISTS idx_consultas_fecha ON consultas(fecha)`);

  // Trigger para updated_at
  await db.exec(`
    CREATE TRIGGER IF NOT EXISTS update_pacientes_updated_at 
    AFTER UPDATE ON pacientes
    BEGIN
      UPDATE pacientes SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END
  `);

  await db.exec(`
    CREATE TRIGGER IF NOT EXISTS update_consultas_updated_at 
    AFTER UPDATE ON consultas
    BEGIN
      UPDATE consultas SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END
  `);

  console.log('📋 SQLite tables created/verified');
};

// Función para obtener la base de datos
export const getSQLiteDB = (): Database => {
  if (!db) throw new Error('SQLite database not initialized. Call initSQLiteDatabase() first.');
  return db;
};

// Función de query para SQLite
export const sqliteQuery = async (sql: string, params: any[] = []): Promise<any> => {
  const database = getSQLiteDB();
  
  const start = Date.now();
  try {
    let result;
    
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      result = await database.all(sql, params);
    } else if (sql.trim().toUpperCase().startsWith('INSERT')) {
      const insertResult = await database.run(sql, params);
      // Para INSERT, devolvemos el ID insertado
      if (insertResult.lastID) {
        // Obtener el registro insertado
        const selectSql = sql.replace(/INSERT INTO (\w+).*/, 'SELECT * FROM $1 WHERE id = ?');
        result = await database.get(selectSql, [insertResult.lastID]);
        result = { rows: [result], rowCount: 1 };
      } else {
        result = { rows: [], rowCount: insertResult.changes || 0 };
      }
    } else {
      const updateResult = await database.run(sql, params);
      result = { rows: [], rowCount: updateResult.changes || 0 };
    }
    
    const duration = Date.now() - start;
    const rowCount = Array.isArray(result) ? result.length : (result as any).rowCount || 0;
    console.log('📊 SQLite Query executed:', { sql: sql.substring(0, 100), duration, rowCount });
    
    // Normalizar respuesta para ser compatible con pg
    if (Array.isArray(result)) {
      return { rows: result, rowCount: result.length };
    }
    
    return result;
  } catch (error) {
    console.error('❌ SQLite Query error:', { sql, error });
    throw error;
  }
};

// Función para probar la conexión
export const testSQLiteConnection = async (): Promise<boolean> => {
  try {
    await initSQLiteDatabase();
    const result = await sqliteQuery('SELECT datetime("now") as now');
    console.log('🔗 SQLite connection successful:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('❌ SQLite connection error:', error);
    return false;
  }
};

// Cerrar la conexión
export const closeSQLiteDB = async (): Promise<void> => {
  if (db) {
    await db.close();
    db = null;
    console.log('🔒 SQLite database closed');
  }
};
