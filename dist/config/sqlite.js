"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeSQLiteDB = exports.testSQLiteConnection = exports.sqliteQuery = exports.getSQLiteDB = exports.initSQLiteDatabase = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const path_1 = __importDefault(require("path"));
let db = null;
const initSQLiteDatabase = async () => {
    if (db)
        return db;
    const dbPath = path_1.default.join(__dirname, '../../database/medilogs2.sqlite');
    db = await (0, sqlite_1.open)({
        filename: dbPath,
        driver: sqlite3_1.default.Database
    });
    await createTables();
    console.log('✅ SQLite database initialized:', dbPath);
    return db;
};
exports.initSQLiteDatabase = initSQLiteDatabase;
const createTables = async () => {
    if (!db)
        throw new Error('Database not initialized');
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
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_pacientes_documento ON pacientes(numero_documento)`);
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_pacientes_activo ON pacientes(activo)`);
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_consultas_paciente_id ON consultas(paciente_id)`);
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_consultas_fecha ON consultas(fecha)`);
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
const getSQLiteDB = () => {
    if (!db)
        throw new Error('SQLite database not initialized. Call initSQLiteDatabase() first.');
    return db;
};
exports.getSQLiteDB = getSQLiteDB;
const sqliteQuery = async (sql, params = []) => {
    const database = (0, exports.getSQLiteDB)();
    const start = Date.now();
    try {
        let result;
        if (sql.trim().toUpperCase().startsWith('SELECT')) {
            result = await database.all(sql, params);
        }
        else if (sql.trim().toUpperCase().startsWith('INSERT')) {
            const insertResult = await database.run(sql, params);
            if (insertResult.lastID) {
                const selectSql = sql.replace(/INSERT INTO (\w+).*/, 'SELECT * FROM $1 WHERE id = ?');
                result = await database.get(selectSql, [insertResult.lastID]);
                result = { rows: [result], rowCount: 1 };
            }
            else {
                result = { rows: [], rowCount: insertResult.changes || 0 };
            }
        }
        else {
            const updateResult = await database.run(sql, params);
            result = { rows: [], rowCount: updateResult.changes || 0 };
        }
        const duration = Date.now() - start;
        const rowCount = Array.isArray(result) ? result.length : result.rowCount || 0;
        console.log('📊 SQLite Query executed:', { sql: sql.substring(0, 100), duration, rowCount });
        if (Array.isArray(result)) {
            return { rows: result, rowCount: result.length };
        }
        return result;
    }
    catch (error) {
        console.error('❌ SQLite Query error:', { sql, error });
        throw error;
    }
};
exports.sqliteQuery = sqliteQuery;
const testSQLiteConnection = async () => {
    try {
        await (0, exports.initSQLiteDatabase)();
        const result = await (0, exports.sqliteQuery)('SELECT datetime("now") as now');
        console.log('🔗 SQLite connection successful:', result.rows[0].now);
        return true;
    }
    catch (error) {
        console.error('❌ SQLite connection error:', error);
        return false;
    }
};
exports.testSQLiteConnection = testSQLiteConnection;
const closeSQLiteDB = async () => {
    if (db) {
        await db.close();
        db = null;
        console.log('🔒 SQLite database closed');
    }
};
exports.closeSQLiteDB = closeSQLiteDB;
//# sourceMappingURL=sqlite.js.map