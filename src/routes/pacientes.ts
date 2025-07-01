import { Router } from 'express';
import { PacienteController } from '../controllers/paciente.controller';

const router = Router();
const pacienteController = new PacienteController();

// GET /api/pacientes - Obtener todos los pacientes (con paginación y búsqueda)
router.get('/', pacienteController.getAllPacientes.bind(pacienteController));

// GET /api/pacientes/:id - Obtener un paciente por ID
router.get('/:id', pacienteController.getPacienteById.bind(pacienteController));

// POST /api/pacientes - Crear un nuevo paciente
router.post('/', pacienteController.createPaciente.bind(pacienteController));

// PUT /api/pacientes/:id - Actualizar un paciente
router.put('/:id', pacienteController.updatePaciente.bind(pacienteController));

// DELETE /api/pacientes/:id - Eliminar un paciente (soft delete)
router.delete('/:id', pacienteController.deletePaciente.bind(pacienteController));

export default router;
