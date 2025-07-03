import { Router } from 'express';
import { AuthController, authValidationSchemas } from './auth.controller';
import { validateBody, sanitizeInput } from '../../shared/middleware';

const router = Router();
const controller = new AuthController();

// Aplicar sanitización a todas las rutas
router.use(sanitizeInput);

/**
 * POST /auth/login
 * Autenticación de médicos
 */
router.post('/login', 
  validateBody(authValidationSchemas.login),
  controller.login
);

/**
 * POST /auth/logout
 * Cerrar sesión
 */
router.post('/logout', 
  controller.logout
);

/**
 * GET /auth/me
 * Obtener información del usuario actual
 */
router.get('/me', 
  controller.getCurrentUser
);

export { router as authRouter };
