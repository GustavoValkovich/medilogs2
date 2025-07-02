import { query } from '../config/database';
import { 
  PacienteDB, 
  PacienteCompleto,
  CreatePacienteRequest, 
  UpdatePacienteRequest 
} from '../types/database';

export class PacienteRepository {

  async findAll(page: number = 1, limit: number = 10, search?: string): Promise<{ pacientes: PacienteCompleto[], total: number }> {
    let whereClause = '';
    let params: any[] = [];
    
    if (search) {
      whereClause = `WHERE (p.nombre ILIKE $1 OR p.documento ILIKE $1)`;
      params.push(`%${search}%`);
    }
    
    // Query para obtener el total
    const countQuery = `
      SELECT COUNT(*) as total
      FROM paciente p
      ${whereClause}
    `;
    
    const countResult = await query(countQuery, params);
    const total = parseInt(countResult.rows[0].total);
    
    // Query principal con paginación y JOIN con médico
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
    const result = await query(mainQuery, params);
    
    return {
      pacientes: result.rows,
      total
    };
  }

  async findById(id: number): Promise<PacienteCompleto | null> {
    const result = await query(`
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

  async findByDocumento(documento: string): Promise<PacienteDB | null> {
    const result = await query(`
      SELECT * FROM paciente WHERE documento = $1
    `, [documento]);
    
    return result.rows[0] || null;
  }

  async create(pacienteData: CreatePacienteRequest): Promise<PacienteDB> {
    const {
      nombre,
      documento,
      nacimiento,
      sexo,
      obra_social,
      mail,
      medico_id,
      importante
    } = pacienteData;

    const result = await query(`
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

  async update(id: number, updateData: UpdatePacienteRequest): Promise<PacienteDB | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    // Construir query dinámicamente
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

    const result = await query(`
      UPDATE paciente 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `, values);

    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await query(`
      DELETE FROM paciente WHERE id = $1
    `, [id]);

    return (result.rowCount || 0) > 0;
  }

  async getPacientesByMedico(medicoId: number): Promise<PacienteDB[]> {
    const result = await query(`
      SELECT * FROM paciente WHERE medico_id = $1 ORDER BY nombre
    `, [medicoId]);

    return result.rows;
  }

  async getPacientesImportantes(): Promise<PacienteDB[]> {
    const result = await query(`
      SELECT * FROM paciente 
      WHERE importante IS NOT NULL 
        AND importante != '' 
        AND importante != 'false' 
        AND importante != 'true'
      ORDER BY nombre
    `);

    return result.rows;
  }
}
