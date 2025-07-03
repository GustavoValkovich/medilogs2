import { Router } from 'express';
import { ConsultationsController, consultationValidationSchemas } from './consultations.controller';
import { validateBody, validateQuery, validateParams, commonSchemas, sanitizeInput } from '../../shared/middleware';

const router = Router();
const controller = new ConsultationsController();

// Aplicar sanitización a todas las rutas
router.use(sanitizeInput);

/**
 * GET /consultations
 * Obtener todas las consultas con paginación
 */
router.get('/', 
  validateQuery(consultationValidationSchemas.query),
  controller.getAllConsultations
);

/**
 * POST /consultations
 * Crear nueva consulta
 */
router.post('/', 
  validateBody(consultationValidationSchemas.create),
  controller.createConsultation
);

/**
 * GET /consultations/recent
 * Obtener últimas consultas
 */
router.get('/recent', 
  controller.getRecentConsultations
);

/**
 * GET /consultations/search
 * Buscar consultas
 */
router.get('/search', 
  validateQuery({ search: { required: true, type: 'string', minLength: 1, maxLength: 100 } }),
  controller.searchConsultations
);

/**
 * GET /consultations/:id
 * Obtener consulta por ID
 */
router.get('/:id', 
  validateParams(commonSchemas.id),
  controller.getConsultationById
);

/**
 * PUT /consultations/:id
 * Actualizar consulta
 */
router.put('/:id', 
  validateParams(commonSchemas.id),
  validateBody(consultationValidationSchemas.update),
  controller.updateConsultation
);

/**
 * DELETE /consultations/:id
 * Eliminar consulta
 */
router.delete('/:id', 
  validateParams(commonSchemas.id),
  controller.deleteConsultation
);

/**
 * GET /consultations/by-patient/:pacienteId
 * Obtener consultas de un paciente específico
 */
router.get('/by-patient/:pacienteId', 
  validateParams({ pacienteId: { required: true, type: 'string', pattern: /^\d+$/ } }),
  controller.getConsultationsByPatient
);

export { router as consultationsRouter };
