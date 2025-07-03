import { Request, Response } from 'express';
import { PacienteRepository } from '../../repositories/paciente-db.repository';
import { 
  CreatePacienteRequest, 
  UpdatePacienteRequest,
  ApiResponse, 
  PaginatedResponse,
  PacienteCompleto 
} from '../../types/database';
import { asyncHandler, createError } from '../../shared/middleware';
import { validateBody, validateQuery, validateParams, commonSchemas } from '../../shared/middleware';
import { createModuleLogger } from '../../shared/utils/logger';

const logger = createModuleLogger('PatientsController');
const pacienteRepository = new PacienteRepository();

/**
 * Controlador modular para pacientes
 */
export class PatientsController {

  /**
   * Obtener todos los pacientes con paginación y búsqueda
   */
  getAllPatients = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;

    logger.info('Obteniendo pacientes', { page, limit, search });

    const { pacientes, total } = await pacienteRepository.findAll(page, limit, search);

    const response: ApiResponse<PaginatedResponse<PacienteCompleto>> = {
      success: true,
      data: {
        data: pacientes,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };

    logger.info(`Pacientes obtenidos: ${pacientes.length}/${total}`);
    res.json(response);
  });

  /**
   * Obtener paciente por ID
   */
  getPatientById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      throw createError('ID de paciente inválido', 400);
    }

    logger.info('Obteniendo paciente por ID', { id });

    const paciente = await pacienteRepository.findById(id);
    
    if (!paciente) {
      throw createError('Paciente no encontrado', 404);
    }

    const response: ApiResponse<PacienteCompleto> = {
      success: true,
      data: paciente
    };

    res.json(response);
  });

  /**
   * Crear nuevo paciente
   */
  createPatient = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const pacienteData: CreatePacienteRequest = req.body;

    logger.info('Creando nuevo paciente', { nombre: pacienteData.nombre });

    const nuevoPaciente = await pacienteRepository.create(pacienteData);

    const response: ApiResponse<PacienteCompleto> = {
      success: true,
      data: nuevoPaciente,
      message: 'Paciente creado exitosamente'
    };

    logger.info('Paciente creado', { id: nuevoPaciente.id });
    res.status(201).json(response);
  });

  /**
   * Actualizar paciente
   */
  updatePatient = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const updateData: UpdatePacienteRequest = req.body;

    if (isNaN(id)) {
      throw createError('ID de paciente inválido', 400);
    }

    logger.info('Actualizando paciente', { id });

    const pacienteActualizado = await pacienteRepository.update(id, updateData);

    if (!pacienteActualizado) {
      throw createError('Paciente no encontrado', 404);
    }

    const response: ApiResponse<PacienteCompleto> = {
      success: true,
      data: pacienteActualizado,
      message: 'Paciente actualizado exitosamente'
    };

    logger.info('Paciente actualizado', { id });
    res.json(response);
  });

  /**
   * Eliminar paciente
   */
  deletePatient = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      throw createError('ID de paciente inválido', 400);
    }

    logger.info('Eliminando paciente', { id });

    const eliminado = await pacienteRepository.delete(id);

    if (!eliminado) {
      throw createError('Paciente no encontrado', 404);
    }

    const response: ApiResponse<null> = {
      success: true,
      data: null,
      message: 'Paciente eliminado exitosamente'
    };

    logger.info('Paciente eliminado', { id });
    res.json(response);
  });

  /**
   * Obtener pacientes importantes
   */
  getImportantPatients = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    logger.info('Obteniendo pacientes importantes');

    const pacientes = await pacienteRepository.getPacientesImportantes();

    const response: ApiResponse<PacienteCompleto[]> = {
      success: true,
      data: pacientes
    };

    logger.info(`Pacientes importantes obtenidos: ${pacientes.length}`);
    res.json(response);
  });

  /**
   * Obtener pacientes por médico
   */
  getPatientsByDoctor = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const medicoId = parseInt(req.params.medicoId);

    if (isNaN(medicoId)) {
      throw createError('ID de médico inválido', 400);
    }

    logger.info('Obteniendo pacientes por médico', { medicoId });

    const pacientes = await pacienteRepository.getPacientesByMedico(medicoId);

    const response: ApiResponse<PacienteCompleto[]> = {
      success: true,
      data: pacientes
    };

    logger.info(`Pacientes del médico ${medicoId}: ${pacientes.length}`);
    res.json(response);
  });
}

/**
 * Esquemas de validación para pacientes
 */
export const patientValidationSchemas = {
  create: {
    nombre: { required: true, type: 'string' as const, minLength: 2, maxLength: 100 },
    apellido: { required: true, type: 'string' as const, minLength: 2, maxLength: 100 },
    fecha_nacimiento: { required: true, type: 'string' as const, pattern: /^\d{4}-\d{2}-\d{2}$/ },
    telefono: { required: false, type: 'string' as const, maxLength: 20 },
    email: { required: false, type: 'string' as const, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    direccion: { required: false, type: 'string' as const, maxLength: 200 },
    importante: { required: false, type: 'boolean' as const }
  },
  
  update: {
    nombre: { required: false, type: 'string' as const, minLength: 2, maxLength: 100 },
    apellido: { required: false, type: 'string' as const, minLength: 2, maxLength: 100 },
    fecha_nacimiento: { required: false, type: 'string' as const, pattern: /^\d{4}-\d{2}-\d{2}$/ },
    telefono: { required: false, type: 'string' as const, maxLength: 20 },
    email: { required: false, type: 'string' as const, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    direccion: { required: false, type: 'string' as const, maxLength: 200 },
    importante: { required: false, type: 'boolean' as const }
  },
  
  query: {
    page: { required: false, type: 'string' as const, pattern: /^\d+$/ },
    limit: { required: false, type: 'string' as const, pattern: /^\d+$/ },
    search: { required: false, type: 'string' as const, maxLength: 100 }
  }
};
