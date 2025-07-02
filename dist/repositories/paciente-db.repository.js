"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacienteRepository = void 0;
const database_1 = require("../config/database");
class PacienteRepository {
    async findAll(page = 1, limit = 10, search) {
        let whereClause = '';
        let params = [];
        if (search) {
            whereClause = `WHERE (p.nombre ILIKE $1 OR p.documento ILIKE $1)`;
            params.push(`%${search}%`);
        }
        const countQuery = `
      SELECT COUNT(*) as total
      FROM paciente p
      ${whereClause}
    `;
        const countResult = await (0, database_1.query)(countQuery, params);
        const total = parseInt(countResult.rows[0].total);
        const offset = (page - 1) * limit;
        const mainQuery = `
      SELECT 
        p.*,
        m.nombre as medico_nombre,
        (SELECT COUNT(*) FROM consulta c WHERE c.paciente_id = p.id) as total_consultas
      FROM paciente p
      LEFT JOIN medico m ON p.medico_id = m.id
      ${whereClause}
      ORDER BY p.id DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;
        params.push(limit, offset);
        const result = await (0, database_1.query)(mainQuery, params);
        return {
            pacientes: result.rows,
            total
        };
    }
    async findById(id) {
        const result = await (0, database_1.query)(`
      SELECT 
        p.*,
        m.nombre as medico_nombre,
        (SELECT COUNT(*) FROM consulta c WHERE c.paciente_id = p.id) as total_consultas
      FROM paciente p
      LEFT JOIN medico m ON p.medico_id = m.id
      WHERE p.id = $1
    `, [id]);
        return result.rows[0] || null;
    }
    async findByDocumento(documento) {
        const result = await (0, database_1.query)(`
      SELECT * FROM paciente WHERE documento = $1
    `, [documento]);
        return result.rows[0] || null;
    }
    async create(pacienteData) {
        const { nombre, documento, nacimiento, sexo, obra_social, mail, medico_id, importante } = pacienteData;
        const result = await (0, database_1.query)(`
      INSERT INTO paciente (
        nombre, documento, nacimiento, sexo, obra_social, mail, medico_id, importante
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
            nombre,
            documento,
            new Date(nacimiento),
            sexo,
            obra_social,
            mail,
            medico_id,
            importante || false
        ]);
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
        if (updateData.documento !== undefined) {
            fields.push(`documento = $${paramCount++}`);
            values.push(updateData.documento);
        }
        if (updateData.nacimiento !== undefined) {
            fields.push(`nacimiento = $${paramCount++}`);
            values.push(new Date(updateData.nacimiento));
        }
        if (updateData.sexo !== undefined) {
            fields.push(`sexo = $${paramCount++}`);
            values.push(updateData.sexo);
        }
        if (updateData.obra_social !== undefined) {
            fields.push(`obra_social = $${paramCount++}`);
            values.push(updateData.obra_social);
        }
        if (updateData.mail !== undefined) {
            fields.push(`mail = $${paramCount++}`);
            values.push(updateData.mail);
        }
        if (updateData.medico_id !== undefined) {
            fields.push(`medico_id = $${paramCount++}`);
            values.push(updateData.medico_id);
        }
        if (updateData.importante !== undefined) {
            fields.push(`importante = $${paramCount++}`);
            values.push(updateData.importante);
        }
        if (fields.length === 0) {
            throw new Error('No fields to update');
        }
        values.push(id);
        const result = await (0, database_1.query)(`
      UPDATE paciente 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `, values);
        return result.rows[0] || null;
    }
    async delete(id) {
        const result = await (0, database_1.query)(`
      DELETE FROM paciente WHERE id = $1
    `, [id]);
        return (result.rowCount || 0) > 0;
    }
    async getPacientesByMedico(medicoId) {
        const result = await (0, database_1.query)(`
      SELECT * FROM paciente WHERE medico_id = $1 ORDER BY nombre
    `, [medicoId]);
        return result.rows;
    }
    async getPacientesImportantes() {
        const result = await (0, database_1.query)(`
      SELECT * FROM paciente WHERE importante = true ORDER BY nombre
    `);
        return result.rows;
    }
}
exports.PacienteRepository = PacienteRepository;
//# sourceMappingURL=paciente-db.repository.js.map