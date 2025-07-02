import { query } from '../config/database';
import { 
  ConsultaMedica, 
  CreateConsultaRequest, 
  UpdateConsultaRequest,
  EstadoConsulta,
  MedicamentoRecetado,
  SignosVitales
} from '../types';

export class ConsultaRepository {

  async findAll(): Promise<ConsultaMedica[]> {
    const result = await query(`
      SELECT 
        id, paciente_id, fecha, hora_inicio, hora_fin, motivo, sintomas,
        signos_vitales, diagnostico, tratamiento, medicamentos_recetados,
        observaciones, proxima_cita, estado, medico, created_at, updated_at
      FROM consultas 
      ORDER BY fecha DESC, hora_inicio DESC
    `);

    return result.rows.map(this.mapRowToConsulta);
  }

  async findById(id: string): Promise<ConsultaMedica | null> {
    const result = await query(`
      SELECT 
        id, paciente_id, fecha, hora_inicio, hora_fin, motivo, sintomas,
        signos_vitales, diagnostico, tratamiento, medicamentos_recetados,
        observaciones, proxima_cita, estado, medico, created_at, updated_at
      FROM consultas 
      WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) return null;
    return this.mapRowToConsulta(result.rows[0]);
  }

  async findByPacienteId(pacienteId: string): Promise<ConsultaMedica[]> {
    const result = await query(`
      SELECT 
        id, paciente_id, fecha, hora_inicio, hora_fin, motivo, sintomas,
        signos_vitales, diagnostico, tratamiento, medicamentos_recetados,
        observaciones, proxima_cita, estado, medico, created_at, updated_at
      FROM consultas 
      WHERE paciente_id = $1
      ORDER BY fecha DESC, hora_inicio DESC
    `, [pacienteId]);

    return result.rows.map(this.mapRowToConsulta);
  }

  async findByEstado(estado: EstadoConsulta): Promise<ConsultaMedica[]> {
    const result = await query(`
      SELECT 
        id, paciente_id, fecha, hora_inicio, hora_fin, motivo, sintomas,
        signos_vitales, diagnostico, tratamiento, medicamentos_recetados,
        observaciones, proxima_cita, estado, medico, created_at, updated_at
      FROM consultas 
      WHERE estado = $1
      ORDER BY fecha DESC, hora_inicio DESC
    `, [estado]);

    return result.rows.map(this.mapRowToConsulta);
  }

  async findByDateRange(fechaInicio: Date, fechaFin: Date): Promise<ConsultaMedica[]> {
    const result = await query(`
      SELECT 
        id, paciente_id, fecha, hora_inicio, hora_fin, motivo, sintomas,
        signos_vitales, diagnostico, tratamiento, medicamentos_recetados,
        observaciones, proxima_cita, estado, medico, created_at, updated_at
      FROM consultas 
      WHERE fecha BETWEEN $1 AND $2
      ORDER BY fecha DESC, hora_inicio DESC
    `, [fechaInicio, fechaFin]);

    return result.rows.map(this.mapRowToConsulta);
  }

  async findByMedico(medico: string): Promise<ConsultaMedica[]> {
    const result = await query(`
      SELECT 
        id, paciente_id, fecha, hora_inicio, hora_fin, motivo, sintomas,
        signos_vitales, diagnostico, tratamiento, medicamentos_recetados,
        observaciones, proxima_cita, estado, medico, created_at, updated_at
      FROM consultas 
      WHERE medico ILIKE $1
      ORDER BY fecha DESC, hora_inicio DESC
    `, [`%${medico}%`]);

    return result.rows.map(this.mapRowToConsulta);
  }

  async create(consultaData: CreateConsultaRequest): Promise<ConsultaMedica> {
    const result = await query(`
      INSERT INTO consultas (
        paciente_id, fecha, hora_inicio, motivo, sintomas, signos_vitales, medico
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING 
        id, paciente_id, fecha, hora_inicio, hora_fin, motivo, sintomas,
        signos_vitales, diagnostico, tratamiento, medicamentos_recetados,
        observaciones, proxima_cita, estado, medico, created_at, updated_at
    `, [
      consultaData.pacienteId,
      consultaData.fecha,
      consultaData.horaInicio,
      consultaData.motivo,
      consultaData.sintomas || [],
      JSON.stringify(consultaData.signosVitales || {}),
      consultaData.medico
    ]);

    return this.mapRowToConsulta(result.rows[0]);
  }

  async update(id: string, updateData: UpdateConsultaRequest): Promise<ConsultaMedica | null> {
    // Construir query dinámicamente
    const fields = [];
    const values = [];
    let paramIndex = 2;

    for (const [key, value] of Object.entries(updateData)) {
      if (value !== undefined && key !== 'id') {
        const dbField = this.mapFieldToDb(key);
        if (key === 'medicamentosRecetados') {
          fields.push(`${dbField} = $${paramIndex}`);
          values.push(JSON.stringify(value));
        } else if (key === 'proximaCita') {
          fields.push(`${dbField} = $${paramIndex}`);
          values.push(value);
        } else {
          fields.push(`${dbField} = $${paramIndex}`);
          values.push(value);
        }
        paramIndex++;
      }
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    const result = await query(`
      UPDATE consultas 
      SET ${fields.join(', ')}
      WHERE id = $1
      RETURNING 
        id, paciente_id, fecha, hora_inicio, hora_fin, motivo, sintomas,
        signos_vitales, diagnostico, tratamiento, medicamentos_recetados,
        observaciones, proxima_cita, estado, medico, created_at, updated_at
    `, [id, ...values]);

    if (result.rows.length === 0) return null;
    return this.mapRowToConsulta(result.rows[0]);
  }

  async delete(id: string): Promise<boolean> {
    const result = await query(`
      DELETE FROM consultas 
      WHERE id = $1
    `, [id]);

    return (result.rowCount || 0) > 0;
  }

  async updateEstado(id: string, estado: EstadoConsulta): Promise<ConsultaMedica | null> {
    const result = await query(`
      UPDATE consultas 
      SET estado = $2
      WHERE id = $1
      RETURNING 
        id, paciente_id, fecha, hora_inicio, hora_fin, motivo, sintomas,
        signos_vitales, diagnostico, tratamiento, medicamentos_recetados,
        observaciones, proxima_cita, estado, medico, created_at, updated_at
    `, [id, estado]);

    if (result.rows.length === 0) return null;
    return this.mapRowToConsulta(result.rows[0]);
  }

  // Estadísticas útiles
  async getEstadisticas(): Promise<any> {
    const result = await query(`
      SELECT 
        COUNT(*) as total_consultas,
        COUNT(CASE WHEN estado = 'PROGRAMADA' THEN 1 END) as programadas,
        COUNT(CASE WHEN estado = 'COMPLETADA' THEN 1 END) as completadas,
        COUNT(CASE WHEN estado = 'CANCELADA' THEN 1 END) as canceladas,
        COUNT(CASE WHEN fecha = CURRENT_DATE THEN 1 END) as consultas_hoy
      FROM consultas
    `);

    return result.rows[0];
  }

  private mapRowToConsulta(row: any): ConsultaMedica {
    return {
      id: row.id,
      pacienteId: row.paciente_id,
      fecha: new Date(row.fecha),
      horaInicio: row.hora_inicio,
      horaFin: row.hora_fin,
      motivo: row.motivo,
      sintomas: row.sintomas || [],
      signosVitales: row.signos_vitales || {},
      diagnostico: row.diagnostico,
      tratamiento: row.tratamiento,
      medicamentosRecetados: row.medicamentos_recetados || [],
      observaciones: row.observaciones,
      proximaCita: row.proxima_cita ? new Date(row.proxima_cita) : undefined,
      estado: row.estado as EstadoConsulta,
      medico: row.medico
    };
  }

  private mapFieldToDb(field: string): string {
    const fieldMap: { [key: string]: string } = {
      'pacienteId': 'paciente_id',
      'horaInicio': 'hora_inicio',
      'horaFin': 'hora_fin',
      'signosVitales': 'signos_vitales',
      'medicamentosRecetados': 'medicamentos_recetados',
      'proximaCita': 'proxima_cita'
    };

    return fieldMap[field] || field;
  }
}
