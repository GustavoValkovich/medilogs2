"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultaRepository = void 0;
const database_1 = require("../config/database");
class ConsultaRepository {
    async findAll(page = 1, limit = 10, pacienteId) {
        let whereClause = '';
        let params = [];
        if (pacienteId) {
            whereClause = `WHERE c.paciente_id = $1`;
            params.push(pacienteId);
        }
        const countQuery = `
      SELECT COUNT(*) as total
      FROM consulta c
      ${whereClause}
    `;
        const countResult = await (0, database_1.query)(countQuery, params);
        const total = parseInt(countResult.rows[0].total);
        const offset = (page - 1) * limit;
        const mainQuery = `
      SELECT 
        c.*,
        p.nombre as paciente_nombre,
        p.documento as paciente_documento
      FROM consulta c
      LEFT JOIN paciente p ON c.paciente_id = p.id
      ${whereClause}
      ORDER BY c.fecha_historia DESC, c.id DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;
        params.push(limit, offset);
        const result = await (0, database_1.query)(mainQuery, params);
        return {
            consultas: result.rows,
            total
        };
    }
    async findById(id) {
        const result = await (0, database_1.query)(`
      SELECT 
        c.*,
        p.nombre as paciente_nombre,
        p.documento as paciente_documento
      FROM consulta c
      LEFT JOIN paciente p ON c.paciente_id = p.id
      WHERE c.id = $1
    `, [id]);
        return result.rows[0] || null;
    }
    async findByPacienteId(pacienteId) {
        const result = await (0, database_1.query)(`
      SELECT * FROM consulta 
      WHERE paciente_id = $1 
      ORDER BY fecha_historia DESC
    `, [pacienteId]);
        return result.rows;
    }
    async create(consultaData) {
        const { paciente_id, fecha_historia, historia, imagen } = consultaData;
        let fechaProcessed;
        if (fecha_historia) {
            fechaProcessed = new Date(fecha_historia);
            if (isNaN(fechaProcessed.getTime())) {
                throw new Error(`Fecha inválida: ${fecha_historia}. Formato esperado: YYYY-MM-DD`);
            }
        }
        else {
            fechaProcessed = new Date();
        }
        const pacienteCheck = await (0, database_1.query)('SELECT id FROM paciente WHERE id = $1', [paciente_id]);
        if (pacienteCheck.rows.length === 0) {
            throw new Error(`Paciente con ID ${paciente_id} no encontrado`);
        }
        if (!historia || historia.trim().length < 5) {
            throw new Error('La historia médica es requerida y debe tener al menos 5 caracteres');
        }
        const result = await (0, database_1.query)(`
      INSERT INTO consulta (
        paciente_id, fecha_historia, historia, imagen
      ) VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [
            paciente_id,
            fechaProcessed,
            historia.trim(),
            imagen
        ]);
        return result.rows[0];
    }
    async update(id, updateData) {
        const fields = [];
        const values = [];
        let paramCount = 1;
        if (updateData.paciente_id !== undefined) {
            const pacienteCheck = await (0, database_1.query)('SELECT id FROM paciente WHERE id = $1', [updateData.paciente_id]);
            if (pacienteCheck.rows.length === 0) {
                throw new Error(`Paciente con ID ${updateData.paciente_id} no encontrado`);
            }
            fields.push(`paciente_id = $${paramCount++}`);
            values.push(updateData.paciente_id);
        }
        if (updateData.fecha_historia !== undefined) {
            const fechaProcessed = new Date(updateData.fecha_historia);
            if (isNaN(fechaProcessed.getTime())) {
                throw new Error(`Fecha inválida: ${updateData.fecha_historia}. Formato esperado: YYYY-MM-DD`);
            }
            fields.push(`fecha_historia = $${paramCount++}`);
            values.push(fechaProcessed);
        }
        if (updateData.historia !== undefined) {
            if (updateData.historia.trim().length < 5) {
                throw new Error('La historia médica debe tener al menos 5 caracteres');
            }
            fields.push(`historia = $${paramCount++}`);
            values.push(updateData.historia.trim());
        }
        if (updateData.imagen !== undefined) {
            fields.push(`imagen = $${paramCount++}`);
            values.push(updateData.imagen);
        }
        if (fields.length === 0) {
            throw new Error('No hay campos para actualizar');
        }
        values.push(id);
        const result = await (0, database_1.query)(`
      UPDATE consulta 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `, values);
        return result.rows[0] || null;
    }
    async delete(id) {
        const result = await (0, database_1.query)(`
      DELETE FROM consulta WHERE id = $1
    `, [id]);
        return (result.rowCount || 0) > 0;
    }
    async getConsultasByDateRange(fechaInicio, fechaFin) {
        const result = await (0, database_1.query)(`
      SELECT * FROM consulta 
      WHERE fecha_historia BETWEEN $1 AND $2
      ORDER BY fecha_historia DESC
    `, [fechaInicio, fechaFin]);
        return result.rows;
    }
    async getUltimasConsultas(limit = 10) {
        const result = await (0, database_1.query)(`
      SELECT 
        c.*,
        p.nombre as paciente_nombre,
        p.documento as paciente_documento
      FROM consulta c
      LEFT JOIN paciente p ON c.paciente_id = p.id
      ORDER BY c.fecha_historia DESC, c.id DESC
      LIMIT $1
    `, [limit]);
        return result.rows;
    }
    async searchConsultas(searchTerm) {
        const result = await (0, database_1.query)(`
      SELECT 
        c.*,
        p.nombre as paciente_nombre,
        p.documento as paciente_documento
      FROM consulta c
      LEFT JOIN paciente p ON c.paciente_id = p.id
      WHERE c.historia ILIKE $1 
         OR p.nombre ILIKE $1 
         OR p.documento ILIKE $1
      ORDER BY c.fecha_historia DESC
    `, [`%${searchTerm}%`]);
        return result.rows;
    }
}
exports.ConsultaRepository = ConsultaRepository;
//# sourceMappingURL=consulta-db.repository.js.map