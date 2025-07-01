import { Router } from 'express';
import { ConsultaController } from '../controllers/consulta.controller';

const router = Router();
const consultaController = new ConsultaController();

// Rutas específicas ANTES que las dinámicas
// GET /api/consultas/paciente/:pacienteId - Obtener consultas de un paciente específico
router.get('/paciente/:pacienteId', consultaController.getConsultasByPaciente.bind(consultaController));

// GET /api/consultas - Obtener todas las consultas (con filtros y paginación)
router.get('/', consultaController.getAllConsultas.bind(consultaController));

// GET /api/consultas/:id - Obtener una consulta por ID
router.get('/:id', consultaController.getConsultaById.bind(consultaController));

// POST /api/consultas - Crear una nueva consulta
router.post('/', consultaController.createConsulta.bind(consultaController));

// PUT /api/consultas/:id - Actualizar una consulta
router.put('/:id', consultaController.updateConsulta.bind(consultaController));

// PATCH /api/consultas/:id/estado - Cambiar estado de una consulta
router.patch('/:id/estado', consultaController.cambiarEstadoConsulta.bind(consultaController));

// DELETE /api/consultas/:id - Eliminar una consulta
router.delete('/:id', consultaController.deleteConsulta.bind(consultaController));

export default router;
