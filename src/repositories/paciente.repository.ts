import { query } from '../config/database';
import { 
  Paciente, 
  CreatePacienteRequest, 
  TipoDocumento, 
  Sexo, 
  GrupoSanguineo 
} from '../types';

export class PacienteRepository {

  async findAll(): Promise<Paciente[]> {
    const result = await query(`
      SELECT 
        id, nombre, apellido, edad, fecha_nacimiento, telefono, email, direccion,
        numero_documento, tipo_documento, sexo, grupo_sanguineo, alergias,
        medicamentos_actuales, enfermedades_cronicas, contacto_emergencia,
        fecha_registro, activo, created_at, updated_at
      FROM pacientes 
      WHERE activo = true 
      ORDER BY created_at DESC
    `);

    return result.rows.map(this.mapRowToPaciente);
  }

  async findById(id: string): Promise<Paciente | null> {
    const result = await query(`
      SELECT 
        id, nombre, apellido, edad, fecha_nacimiento, telefono, email, direccion,
        numero_documento, tipo_documento, sexo, grupo_sanguineo, alergias,
        medicamentos_actuales, enfermedades_cronicas, contacto_emergencia,
        fecha_registro, activo, created_at, updated_at
      FROM pacientes 
      WHERE id = $1 AND activo = true
    `, [id]);

    if (result.rows.length === 0) return null;
    return this.mapRowToPaciente(result.rows[0]);
  }

  async findByDocumento(numeroDocumento: string): Promise<Paciente | null> {
    const result = await query(`
      SELECT 
        id, nombre, apellido, edad, fecha_nacimiento, telefono, email, direccion,
        numero_documento, tipo_documento, sexo, grupo_sanguineo, alergias,
        medicamentos_actuales, enfermedades_cronicas, contacto_emergencia,
        fecha_registro, activo, created_at, updated_at
      FROM pacientes 
      WHERE numero_documento = $1 AND activo = true
    `, [numeroDocumento]);

    if (result.rows.length === 0) return null;
    return this.mapRowToPaciente(result.rows[0]);
  }

  async create(pacienteData: CreatePacienteRequest): Promise<Paciente> {
    const result = await query(`
      INSERT INTO pacientes (
        nombre, apellido, edad, fecha_nacimiento, telefono, email, direccion,
        numero_documento, tipo_documento, sexo, grupo_sanguineo, alergias,
        medicamentos_actuales, enfermedades_cronicas, contacto_emergencia
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING 
        id, nombre, apellido, edad, fecha_nacimiento, telefono, email, direccion,
        numero_documento, tipo_documento, sexo, grupo_sanguineo, alergias,
        medicamentos_actuales, enfermedades_cronicas, contacto_emergencia,
        fecha_registro, activo, created_at, updated_at
    `, [
      pacienteData.nombre,
      pacienteData.apellido,
      pacienteData.edad,
      pacienteData.fechaNacimiento,
      pacienteData.telefono,
      pacienteData.email,
      pacienteData.direccion,
      pacienteData.numeroDocumento,
      pacienteData.tipoDocumento,
      pacienteData.sexo,
      pacienteData.grupoSanguineo,
      pacienteData.alergias,
      pacienteData.medicamentosActuales,
      pacienteData.enfermedadesCronicas,
      pacienteData.contactoEmergencia
    ]);

    return this.mapRowToPaciente(result.rows[0]);
  }

  async update(id: string, updateData: Partial<Paciente>): Promise<Paciente | null> {
    // Construir query dinámicamente solo con los campos que se quieren actualizar
    const fields = [];
    const values = [];
    let paramIndex = 2; // Empezamos en 2 porque el primer parámetro será el ID

    for (const [key, value] of Object.entries(updateData)) {
      if (value !== undefined && key !== 'id' && key !== 'fechaRegistro' && key !== 'activo') {
        const dbField = this.mapFieldToDb(key);
        fields.push(`${dbField} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    }

    if (fields.length === 0) {
      return this.findById(id); // No hay nada que actualizar
    }

    const result = await query(`
      UPDATE pacientes 
      SET ${fields.join(', ')}
      WHERE id = $1 AND activo = true
      RETURNING 
        id, nombre, apellido, edad, fecha_nacimiento, telefono, email, direccion,
        numero_documento, tipo_documento, sexo, grupo_sanguineo, alergias,
        medicamentos_actuales, enfermedades_cronicas, contacto_emergencia,
        fecha_registro, activo, created_at, updated_at
    `, [id, ...values]);

    if (result.rows.length === 0) return null;
    return this.mapRowToPaciente(result.rows[0]);
  }

  async delete(id: string): Promise<boolean> {
    const result = await query(`
      UPDATE pacientes 
      SET activo = false 
      WHERE id = $1 AND activo = true
    `, [id]);

    return (result.rowCount || 0) > 0;
  }

  async search(searchTerm: string, limit: number = 10, offset: number = 0): Promise<Paciente[]> {
    const result = await query(`
      SELECT 
        id, nombre, apellido, edad, fecha_nacimiento, telefono, email, direccion,
        numero_documento, tipo_documento, sexo, grupo_sanguineo, alergias,
        medicamentos_actuales, enfermedades_cronicas, contacto_emergencia,
        fecha_registro, activo, created_at, updated_at
      FROM pacientes 
      WHERE activo = true 
        AND (
          nombre ILIKE $1 OR 
          apellido ILIKE $1 OR 
          numero_documento ILIKE $1 OR
          email ILIKE $1
        )
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `, [`%${searchTerm}%`, limit, offset]);

    return result.rows.map(this.mapRowToPaciente);
  }

  private mapRowToPaciente(row: any): Paciente {
    return {
      id: row.id,
      nombre: row.nombre,
      apellido: row.apellido,
      edad: row.edad,
      fechaNacimiento: new Date(row.fecha_nacimiento),
      telefono: row.telefono,
      email: row.email,
      direccion: row.direccion,
      numeroDocumento: row.numero_documento,
      tipoDocumento: row.tipo_documento as TipoDocumento,
      sexo: row.sexo as Sexo,
      grupoSanguineo: row.grupo_sanguineo as GrupoSanguineo,
      alergias: row.alergias || [],
      medicamentosActuales: row.medicamentos_actuales || [],
      enfermedadesCronicas: row.enfermedades_cronicas || [],
      contactoEmergencia: row.contacto_emergencia,
      fechaRegistro: new Date(row.fecha_registro),
      activo: row.activo
    };
  }

  private mapFieldToDb(field: string): string {
    const fieldMap: { [key: string]: string } = {
      'fechaNacimiento': 'fecha_nacimiento',
      'numeroDocumento': 'numero_documento',
      'tipoDocumento': 'tipo_documento',
      'grupoSanguineo': 'grupo_sanguineo',
      'medicamentosActuales': 'medicamentos_actuales',
      'enfermedadesCronicas': 'enfermedades_cronicas',
      'contactoEmergencia': 'contacto_emergencia',
      'fechaRegistro': 'fecha_registro'
    };

    return fieldMap[field] || field;
  }
}
