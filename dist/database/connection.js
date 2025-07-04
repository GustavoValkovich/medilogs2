"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConnection = exports.query = exports.closeDatabase = exports.getDatabase = exports.createDatabaseConnection = void 0;
const pg_1 = require("pg");
const sqlite_1 = require("sqlite");
const sqlite3_1 = __importDefault(require("sqlite3"));
const config_1 = require("../core/config");
const logger_1 = require("../shared/utils/logger");
const path_1 = __importDefault(require("path"));
class PostgreSQLConnection {
    constructor() {
        this.type = 'postgresql';
        this.pool = new pg_1.Pool({
            user: config_1.config.database.user,
            password: config_1.config.database.password,
            host: config_1.config.database.host,
            port: config_1.config.database.port,
            database: config_1.config.database.database,
            max: config_1.config.database.maxConnections,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: config_1.config.database.connectionTimeout,
        });
        this.pool.on('connect', () => {
            logger_1.logger.debug('✅ Nueva conexión PostgreSQL establecida');
        });
        this.pool.on('error', (err) => {
            logger_1.logger.error('❌ Error inesperado en PostgreSQL:', err);
        });
    }
    async query(text, params) {
        const start = Date.now();
        try {
            const result = await this.pool.query(text, params);
            const duration = Date.now() - start;
            logger_1.logger.query(text, duration, result.rowCount || 0);
            return {
                rows: result.rows,
                rowCount: result.rowCount || 0
            };
        }
        catch (error) {
            const duration = Date.now() - start;
            logger_1.logger.error(`❌ Error en query (${duration}ms):`, { text, error });
            throw error;
        }
    }
    async testConnection() {
        try {
            const client = await this.pool.connect();
            const result = await client.query('SELECT NOW()');
            client.release();
            logger_1.logger.info('🔗 Conexión PostgreSQL exitosa:', result.rows[0].now);
            return true;
        }
        catch (error) {
            logger_1.logger.error('❌ Error conectando a PostgreSQL:', error);
            return false;
        }
    }
    async close() {
        await this.pool.end();
        logger_1.logger.info('🔒 Pool de conexiones PostgreSQL cerrado');
    }
}
class SQLiteConnection {
    constructor() {
        this.db = null;
        this.type = 'sqlite';
    }
    async init() {
        if (this.db)
            return;
        const dbPath = path_1.default.join(__dirname, '../../database/medilogs2.sqlite');
        this.db = await (0, sqlite_1.open)({
            filename: dbPath,
            driver: sqlite3_1.default.Database
        });
        await this.createTables();
        logger_1.logger.info('✅ SQLite database inicializada:', dbPath);
    }
    async createTables() {
        if (!this.db)
            throw new Error('Database not initialized');
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
        await this.db.exec(`
      CREATE TABLE IF NOT EXISTS consulta (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        paciente_id INTEGER,
        fecha_historia DATETIME,
        historia TEXT,
        imagen TEXT
      )
    `);
        await this.db.exec(`
      CREATE TABLE IF NOT EXISTS medico (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      )
    `);
        logger_1.logger.debug('📋 Tablas SQLite creadas/verificadas');
    }
    async query(text, params) {
        if (!this.db) {
            await this.init();
        }
        const start = Date.now();
        try {
            let result;
            if (text.trim().toUpperCase().startsWith('SELECT')) {
                result = await this.db.all(text, params);
                return {
                    rows: result,
                    rowCount: result.length
                };
            }
            else if (text.trim().toUpperCase().startsWith('INSERT')) {
                const insertResult = await this.db.run(text, params);
                if (insertResult.lastID) {
                    const tableName = text.match(/INSERT INTO (\w+)/)?.[1];
                    if (tableName) {
                        const selectResult = await this.db.get(`SELECT * FROM ${tableName} WHERE id = ?`, [insertResult.lastID]);
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
            }
            else {
                const updateResult = await this.db.run(text, params);
                return {
                    rows: [],
                    rowCount: updateResult.changes || 0
                };
            }
        }
        catch (error) {
            const duration = Date.now() - start;
            logger_1.logger.error(`❌ Error en SQLite query (${duration}ms):`, { text, error });
            throw error;
        }
    }
    async testConnection() {
        try {
            await this.init();
            await this.query('SELECT 1');
            logger_1.logger.info('🔗 Conexión SQLite exitosa');
            return true;
        }
        catch (error) {
            logger_1.logger.error('❌ Error conectando a SQLite:', error);
            return false;
        }
    }
    async close() {
        if (this.db) {
            await this.db.close();
            this.db = null;
            logger_1.logger.info('🔒 Base de datos SQLite cerrada');
        }
    }
}
const createDatabaseConnection = async () => {
    if (config_1.config.database.type === 'postgresql') {
        const pgConnection = new PostgreSQLConnection();
        const isAvailable = await pgConnection.testConnection();
        if (isAvailable) {
            return pgConnection;
        }
        else {
            logger_1.logger.warn('⚠️  PostgreSQL no disponible, cambiando a SQLite...');
            await pgConnection.close();
        }
    }
    const sqliteConnection = new SQLiteConnection();
    await sqliteConnection.init();
    return sqliteConnection;
};
exports.createDatabaseConnection = createDatabaseConnection;
let dbConnection = null;
const getDatabase = async () => {
    if (!dbConnection) {
        dbConnection = await (0, exports.createDatabaseConnection)();
    }
    return dbConnection;
};
exports.getDatabase = getDatabase;
const closeDatabase = async () => {
    if (dbConnection) {
        await dbConnection.close();
        dbConnection = null;
    }
};
exports.closeDatabase = closeDatabase;
const query = async (text, params) => {
    const db = await (0, exports.getDatabase)();
    return db.query(text, params);
};
exports.query = query;
const testConnection = async () => {
    const db = await (0, exports.getDatabase)();
    return db.testConnection();
};
exports.testConnection = testConnection;
//# sourceMappingURL=connection.js.map