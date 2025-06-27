const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

// Obtener todos los pacientes del médico autenticado
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM pacientes WHERE medico_id = $1',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los pacientes' });
  }
});

// Crear un nuevo paciente
router.post('/', authMiddleware, async (req, res) => {
  const { nombre, apellido, dni, fecha_nacimiento, genero } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO pacientes (medico_id, nombre, apellido, dni, fecha_nacimiento, genero)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [req.user.id, nombre, apellido, dni, fecha_nacimiento, genero]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear el paciente' });
  }
});

module.exports = router;
