const pool = require('../models/db');

exports.getPacientesByMedico = async (req, res) => {
  const medicoId = req.user.id; // obtenido de JWT
  const result = await pool.query('SELECT * FROM paciente WHERE medico_id = $1', [medicoId]);
  res.json(result.rows);
};

exports.createPaciente = async (req, res) => {
  const { nombre, documento, nacimiento, importante, sexo, obra_social, mail } = req.body;
  const medicoId = req.user.id;
  const result = await pool.query(
    'INSERT INTO paciente (medico_id, nombre, documento, nacimiento, importante, sexo, obra_social, mail) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
    [medicoId, nombre, documento, nacimiento, importante, sexo, obra_social, mail]
  );
  res.status(201).json(result.rows[0]);
};