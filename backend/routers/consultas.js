const express = require('express');
const router = express.Router();
const consultaController = require('../controllers/consultaController');
const authMiddleware = require('../middleware/auth');

router.get('/:pacienteId', authMiddleware, consultaController.getConsultasByPaciente);
router.post('/:pacienteId', authMiddleware, consultaController.createConsulta);

module.exports = router;
