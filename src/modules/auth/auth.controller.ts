import { Request, Response } from 'express';
import { MedicoRepository } from '../../repositories/medico-db.repository';
import { ApiResponse } from '../../types/database';
import { asyncHandler, createError } from '../../shared/middleware';
import { createModuleLogger } from '../../shared/utils/logger';

const logger = createModuleLogger('AuthController');
const medicoRepository = new MedicoRepository();

/**
 * Controlador de autenticación
 */
export class AuthController {

  /**
   * Login de médico
   */
  login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    logger.info('Intento de login', { email });

    // Validar credenciales usando el método del repositorio
    const medico = await medicoRepository.validatePassword(email, password);
    
    if (!medico) {
      logger.warn('Login fallido: credenciales inválidas', { email });
      throw createError('Credenciales inválidas', 401);
    }

    // Crear sesión/token (implementación básica)
    const sessionData = {
      id: medico.id,
      email: medico.email,
      nombre: medico.nombre
    };

    const response: ApiResponse<any> = {
      success: true,
      data: {
        medico: sessionData,
        message: 'Login exitoso'
      }
    };

    logger.info('Login exitoso', { email, medicoId: medico.id });
    res.json(response);
  });

  /**
   * Logout (implementación básica)
   */
  logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    logger.info('Logout de usuario');

    const response: ApiResponse<null> = {
      success: true,
      data: null,
      message: 'Logout exitoso'
    };

    res.json(response);
  });

  /**
   * Verificar password (implementación básica)
   * En producción, usar bcrypt para comparar hashes
   */
  private async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    // TODO: Implementar verificación con bcrypt
    // Por ahora comparación directa para compatibilidad
    return plainPassword === hashedPassword;
  }

  /**
   * Obtener información del médico actual (si hay sesión activa)
   */
  getCurrentUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    // TODO: Implementar cuando se agregue middleware de autenticación
    const response: ApiResponse<null> = {
      success: false,
      message: 'Función no implementada - requiere middleware de autenticación'
    };

    res.status(501).json(response);
  });
}

/**
 * Esquemas de validación para autenticación
 */
export const authValidationSchemas = {
  login: {
    email: { required: true, type: 'string' as const, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    password: { required: true, type: 'string' as const, minLength: 1 }
  }
};
