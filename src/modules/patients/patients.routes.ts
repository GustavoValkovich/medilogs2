import { Router } from 'express';
import { PatientsController, patientValidationSchemas } from './patients.controller';
import { validateBody, validateQuery, validateParams, commonSchemas, sanitizeInput } from '../../shared/middleware';

const router = Router();
const controller = new PatientsController();

// Aplicar sanitización a todas las rutas
router.use(sanitizeInput);

/**
 * GET /patients
 * Obtener todos los pacientes con paginación y búsqueda
 */
router.get('/', 
  validateQuery(patientValidationSchemas.query),
  controller.getAllPatients
);

/**
 * POST /patients
 * Crear nuevo paciente
 */
router.post('/', 
  validateBody(patientValidationSchemas.create),
  controller.createPatient
);

/**
 * GET /patients/important
 * Obtener pacientes marcados como importantes
 */
router.get('/important', 
  controller.getImportantPatients
);

/**
 * GET /patients/:id
 * Obtener paciente por ID
 */
router.get('/:id', 
  validateParams(commonSchemas.id),
  controller.getPatientById
);

/**
 * PUT /patients/:id
 * Actualizar paciente
 */
router.put('/:id', 
  validateParams(commonSchemas.id),
  validateBody(patientValidationSchemas.update),
  controller.updatePatient
);

/**
 * DELETE /patients/:id
 * Eliminar paciente
 */
router.delete('/:id', 
  validateParams(commonSchemas.id),
  controller.deletePatient
);

/**
 * GET /patients/by-doctor/:medicoId
 * Obtener pacientes de un médico específico
 */
router.get('/by-doctor/:medicoId', 
  validateParams({ medicoId: { required: true, type: 'string', pattern: /^\d+$/ } }),
  controller.getPatientsByDoctor
);

export { router as patientsRouter };
