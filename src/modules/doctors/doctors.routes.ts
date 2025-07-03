import { Router } from 'express';
import { DoctorsController, doctorValidationSchemas } from './doctors.controller';
import { validateBody, validateParams, commonSchemas, sanitizeInput } from '../../shared/middleware';

const router = Router();
const controller = new DoctorsController();

// Aplicar sanitización a todas las rutas
router.use(sanitizeInput);

/**
 * GET /doctors
 * Obtener todos los médicos
 */
router.get('/', 
  controller.getAllDoctors
);

/**
 * POST /doctors
 * Crear nuevo médico
 */
router.post('/', 
  validateBody(doctorValidationSchemas.create),
  controller.createDoctor
);

/**
 * GET /doctors/:id
 * Obtener médico por ID
 */
router.get('/:id', 
  validateParams(commonSchemas.id),
  controller.getDoctorById
);

/**
 * PUT /doctors/:id
 * Actualizar médico
 */
router.put('/:id', 
  validateParams(commonSchemas.id),
  validateBody(doctorValidationSchemas.update),
  controller.updateDoctor
);

/**
 * DELETE /doctors/:id
 * Eliminar médico
 */
router.delete('/:id', 
  validateParams(commonSchemas.id),
  controller.deleteDoctor
);

export { router as doctorsRouter };
