"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicoRepository = void 0;
const database_1 = require("../config/database");
const bcrypt = __importStar(require("bcrypt"));
class MedicoRepository {
    async findAll() {
        const result = await (0, database_1.query)(`
      SELECT id, nombre, email FROM medico ORDER BY nombre
    `);
        return result.rows;
    }
    async findById(id) {
        const result = await (0, database_1.query)(`
      SELECT id, nombre, email FROM medico WHERE id = $1
    `, [id]);
        return result.rows[0] || null;
    }
    async findByEmail(email) {
        const result = await (0, database_1.query)(`
      SELECT * FROM medico WHERE email = $1
    `, [email]);
        return result.rows[0] || null;
    }
    async create(medicoData) {
        const { nombre, email, password } = medicoData;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const result = await (0, database_1.query)(`
      INSERT INTO medico (nombre, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, nombre, email
    `, [nombre, email, hashedPassword]);
        return result.rows[0];
    }
    async update(id, updateData) {
        const fields = [];
        const values = [];
        let paramCount = 1;
        if (updateData.nombre !== undefined) {
            fields.push(`nombre = $${paramCount++}`);
            values.push(updateData.nombre);
        }
        if (updateData.email !== undefined) {
            fields.push(`email = $${paramCount++}`);
            values.push(updateData.email);
        }
        if (updateData.password !== undefined) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(updateData.password, saltRounds);
            fields.push(`password = $${paramCount++}`);
            values.push(hashedPassword);
        }
        if (fields.length === 0) {
            throw new Error('No fields to update');
        }
        values.push(id);
        const result = await (0, database_1.query)(`
      UPDATE medico 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, nombre, email
    `, values);
        return result.rows[0] || null;
    }
    async delete(id) {
        const pacientesCount = await (0, database_1.query)(`
      SELECT COUNT(*) FROM paciente WHERE medico_id = $1
    `, [id]);
        if (parseInt(pacientesCount.rows[0].count) > 0) {
            throw new Error('No se puede eliminar un médico que tiene pacientes asignados');
        }
        const result = await (0, database_1.query)(`
      DELETE FROM medico WHERE id = $1
    `, [id]);
        return (result.rowCount || 0) > 0;
    }
    async validatePassword(email, password) {
        const result = await (0, database_1.query)(`
      SELECT id, nombre, email, password FROM medico WHERE email = $1
    `, [email]);
        if (result.rows.length === 0) {
            return null;
        }
        const medico = result.rows[0];
        const isValidPassword = await bcrypt.compare(password, medico.password);
        if (!isValidPassword) {
            return null;
        }
        const { password: _, ...medicoSinPassword } = medico;
        return medicoSinPassword;
    }
}
exports.MedicoRepository = MedicoRepository;
//# sourceMappingURL=medico-db.repository.js.map