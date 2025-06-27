const pool = require('../db');

// Obtener todas las consultas de un paciente específico
exports.getConsultasByPaciente = async (req, res) => {
  const { pacienteId } = req.params;
  const medicoId = req.user.id;

  try {
    const result = await pool.query(
      'SELECT * FROM consultas WHERE paciente_id = $1 AND medico_id = $2 ORDER BY fecha DESC',
      [pacienteId, medicoId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener las consultas' });
  }
};

// Crear una nueva consulta para un paciente
exports.createConsulta = async (req, res) => {
  const { pacienteId } = req.params;
  const { fecha, motivo, diagnostico, tratamiento, archivos } = req.body;
  const medicoId = req.user.id;

  try {
    const result = await pool.query(
      `INSERT INTO consultas (paciente_id, medico_id, fecha, motivo, diagnostico, tratamiento, archivos)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [pacienteId, medicoId, fecha, motivo, diagnostico, tratamiento, archivos]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear la consulta' });
  }
};
