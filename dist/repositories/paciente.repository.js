"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacienteRepository = void 0;
const database_1 = require("../config/database");
class PacienteRepository {
    async findAll() {
        const result = await (0, database_1.query)(`
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
    async findById(id) {
        const result = await (0, database_1.query)(`
      SELECT 
        id, nombre, apellido, edad, fecha_nacimiento, telefono, email, direccion,
        numero_documento, tipo_documento, sexo, grupo_sanguineo, alergias,
        medicamentos_actuales, enfermedades_cronicas, contacto_emergencia,
        fecha_registro, activo, created_at, updated_at
      FROM pacientes 
      WHERE id = $1 AND activo = true
    `, [id]);
        if (result.rows.length === 0)
            return null;
        return this.mapRowToPaciente(result.rows[0]);
    }
    async findByDocumento(numeroDocumento) {
        const result = await (0, database_1.query)(`
      SELECT 
        id, nombre, apellido, edad, fecha_nacimiento, telefono, email, direccion,
        numero_documento, tipo_documento, sexo, grupo_sanguineo, alergias,
        medicamentos_actuales, enfermedades_cronicas, contacto_emergencia,
        fecha_registro, activo, created_at, updated_at
      FROM pacientes 
      WHERE numero_documento = $1 AND activo = true
    `, [numeroDocumento]);
        if (result.rows.length === 0)
            return null;
        return this.mapRowToPaciente(result.rows[0]);
    }
    async create(pacienteData) {
        const result = await (0, database_1.query)(`
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
    async update(id, updateData) {
        const fields = [];
        const values = [];
        let paramIndex = 2;
        for (const [key, value] of Object.entries(updateData)) {
            if (value !== undefined && key !== 'id' && key !== 'fechaRegistro' && key !== 'activo') {
                const dbField = this.mapFieldToDb(key);
                fields.push(`${dbField} = $${paramIndex}`);
                values.push(value);
                paramIndex++;
            }
        }
        if (fields.length === 0) {
            return this.findById(id);
        }
        const result = await (0, database_1.query)(`
      UPDATE pacientes 
      SET ${fields.join(', ')}
      WHERE id = $1 AND activo = true
      RETURNING 
        id, nombre, apellido, edad, fecha_nacimiento, telefono, email, direccion,
        numero_documento, tipo_documento, sexo, grupo_sanguineo, alergias,
        medicamentos_actuales, enfermedades_cronicas, contacto_emergencia,
        fecha_registro, activo, created_at, updated_at
    `, [id, ...values]);
        if (result.rows.length === 0)
            return null;
        return this.mapRowToPaciente(result.rows[0]);
    }
    async delete(id) {
        const result = await (0, database_1.query)(`
      UPDATE pacientes 
      SET activo = false 
      WHERE id = $1 AND activo = true
    `, [id]);
        return (result.rowCount || 0) > 0;
    }
    async search(searchTerm, limit = 10, offset = 0) {
        const result = await (0, database_1.query)(`
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
    mapRowToPaciente(row) {
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
            tipoDocumento: row.tipo_documento,
            sexo: row.sexo,
            grupoSanguineo: row.grupo_sanguineo,
            alergias: row.alergias || [],
            medicamentosActuales: row.medicamentos_actuales || [],
            enfermedadesCronicas: row.enfermedades_cronicas || [],
            contactoEmergencia: row.contacto_emergencia,
            fechaRegistro: new Date(row.fecha_registro),
            activo: row.activo
        };
    }
    mapFieldToDb(field) {
        const fieldMap = {
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
exports.PacienteRepository = PacienteRepository;
//# sourceMappingURL=paciente.repository.js.map