import { query } from '../config/database';
import { 
  ConsultaDB, 
  ConsultaCompleta,
  CreateConsultaRequest, 
  UpdateConsultaRequest 
} from '../types/database';

export class ConsultaRepository {

  async findAll(page: number = 1, limit: number = 10, pacienteId?: number): Promise<{ consultas: ConsultaCompleta[], total: number }> {
    let whereClause = '';
    let params: any[] = [];
    
    if (pacienteId) {
      whereClause = `WHERE c.paciente_id = $1`;
      params.push(pacienteId);
    }
    
    // Query para obtener el total
    const countQuery = `
      SELECT COUNT(*) as total
      FROM consulta c
      ${whereClause}
    `;
    
    const countResult = await query(countQuery, params);
    const total = parseInt(countResult.rows[0].total);
    
    // Query principal con paginación y JOIN con paciente
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
    const result = await query(mainQuery, params);
    
    return {
      consultas: result.rows,
      total
    };
  }

  async findById(id: number): Promise<ConsultaCompleta | null> {
    const result = await query(`
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

  async findByPacienteId(pacienteId: number): Promise<ConsultaDB[]> {
    const result = await query(`
      SELECT * FROM consulta 
      WHERE paciente_id = $1 
      ORDER BY fecha_historia DESC
    `, [pacienteId]);
    
    return result.rows;
  }

  async create(consultaData: CreateConsultaRequest): Promise<ConsultaDB> {
    const {
      paciente_id,
      fecha_historia,
      historia,
      imagen
    } = consultaData;

    // Validar y procesar la fecha
    let fechaProcessed: Date;
    if (fecha_historia) {
      fechaProcessed = new Date(fecha_historia);
      if (isNaN(fechaProcessed.getTime())) {
        throw new Error(`Fecha inválida: ${fecha_historia}. Formato esperado: YYYY-MM-DD`);
      }
    } else {
      fechaProcessed = new Date(); // Usar fecha actual si no se proporciona
    }

    // Validar que el paciente existe
    const pacienteCheck = await query('SELECT id FROM paciente WHERE id = $1', [paciente_id]);
    if (pacienteCheck.rows.length === 0) {
      throw new Error(`Paciente con ID ${paciente_id} no encontrado`);
    }

    // Validar campos requeridos
    if (!historia || historia.trim().length < 5) {
      throw new Error('La historia médica es requerida y debe tener al menos 5 caracteres');
    }

    const result = await query(`
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

  async update(id: number, updateData: UpdateConsultaRequest): Promise<ConsultaDB | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    // Construir query dinámicamente
    if (updateData.paciente_id !== undefined) {
      // Validar que el paciente existe
      const pacienteCheck = await query('SELECT id FROM paciente WHERE id = $1', [updateData.paciente_id]);
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

    const result = await query(`
      UPDATE consulta 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `, values);

    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await query(`
      DELETE FROM consulta WHERE id = $1
    `, [id]);

    return (result.rowCount || 0) > 0;
  }

  async getConsultasByDateRange(fechaInicio: Date, fechaFin: Date): Promise<ConsultaDB[]> {
    const result = await query(`
      SELECT * FROM consulta 
      WHERE fecha_historia BETWEEN $1 AND $2
      ORDER BY fecha_historia DESC
    `, [fechaInicio, fechaFin]);

    return result.rows;
  }

  async getUltimasConsultas(limit: number = 10): Promise<ConsultaCompleta[]> {
    const result = await query(`
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

  async searchConsultas(searchTerm: string): Promise<ConsultaCompleta[]> {
    const result = await query(`
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
