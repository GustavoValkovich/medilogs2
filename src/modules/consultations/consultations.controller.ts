import { Request, Response } from 'express';
import { ConsultaRepository } from '../../repositories/consulta-db.repository';
import { 
  CreateConsultaRequest, 
  UpdateConsultaRequest,
  ApiResponse, 
  PaginatedResponse,
  ConsultaCompleta 
} from '../../types/database';
import { asyncHandler, createError } from '../../shared/middleware';
import { createModuleLogger } from '../../shared/utils/logger';

const logger = createModuleLogger('ConsultationsController');
const consultaRepository = new ConsultaRepository();

/**
 * Controlador modular para consultas
 */
export class ConsultationsController {

  /**
   * Obtener todas las consultas con paginación
   */
  getAllConsultations = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const pacienteId = req.query.pacienteId ? parseInt(req.query.pacienteId as string) : undefined;

    logger.info('Obteniendo consultas', { page, limit, pacienteId });

    const { consultas, total } = await consultaRepository.findAll(page, limit, pacienteId);

    const response: ApiResponse<PaginatedResponse<ConsultaCompleta>> = {
      success: true,
      data: {
        data: consultas,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };

    logger.info(`Consultas obtenidas: ${consultas.length}/${total}`);
    res.json(response);
  });

  /**
   * Obtener consulta por ID
   */
  getConsultationById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      throw createError('ID de consulta inválido', 400);
    }

    logger.info('Obteniendo consulta por ID', { id });

    const consulta = await consultaRepository.findById(id);
    
    if (!consulta) {
      throw createError('Consulta no encontrada', 404);
    }

    const response: ApiResponse<ConsultaCompleta> = {
      success: true,
      data: consulta
    };

    res.json(response);
  });

  /**
   * Crear nueva consulta
   */
  createConsultation = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const consultaData: CreateConsultaRequest = req.body;

    logger.info('Creando nueva consulta', { pacienteId: consultaData.paciente_id });

    const nuevaConsulta = await consultaRepository.create(consultaData);

    const response: ApiResponse<ConsultaCompleta> = {
      success: true,
      data: nuevaConsulta,
      message: 'Consulta creada exitosamente'
    };

    logger.info('Consulta creada', { id: nuevaConsulta.id });
    res.status(201).json(response);
  });

  /**
   * Actualizar consulta
   */
  updateConsultation = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const updateData: UpdateConsultaRequest = req.body;

    if (isNaN(id)) {
      throw createError('ID de consulta inválido', 400);
    }

    logger.info('Actualizando consulta', { id });

    const consultaActualizada = await consultaRepository.update(id, updateData);

    if (!consultaActualizada) {
      throw createError('Consulta no encontrada', 404);
    }

    const response: ApiResponse<ConsultaCompleta> = {
      success: true,
      data: consultaActualizada,
      message: 'Consulta actualizada exitosamente'
    };

    logger.info('Consulta actualizada', { id });
    res.json(response);
  });

  /**
   * Eliminar consulta
   */
  deleteConsultation = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      throw createError('ID de consulta inválido', 400);
    }

    logger.info('Eliminando consulta', { id });

    const eliminada = await consultaRepository.delete(id);

    if (!eliminada) {
      throw createError('Consulta no encontrada', 404);
    }

    const response: ApiResponse<null> = {
      success: true,
      data: null,
      message: 'Consulta eliminada exitosamente'
    };

    logger.info('Consulta eliminada', { id });
    res.json(response);
  });

  /**
   * Obtener consultas por paciente
   */
  getConsultationsByPatient = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const pacienteId = parseInt(req.params.pacienteId);

    if (isNaN(pacienteId)) {
      throw createError('ID de paciente inválido', 400);
    }

    logger.info('Obteniendo consultas por paciente', { pacienteId });

    const consultas = await consultaRepository.findByPacienteId(pacienteId);

    const response: ApiResponse<ConsultaCompleta[]> = {
      success: true,
      data: consultas
    };

    logger.info(`Consultas del paciente ${pacienteId}: ${consultas.length}`);
    res.json(response);
  });

  /**
   * Obtener últimas consultas
   */
  getRecentConsultations = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const limit = parseInt(req.query.limit as string) || 10;

    logger.info('Obteniendo últimas consultas', { limit });

    const consultas = await consultaRepository.getUltimasConsultas(limit);

    const response: ApiResponse<ConsultaCompleta[]> = {
      success: true,
      data: consultas
    };

    logger.info(`Últimas consultas obtenidas: ${consultas.length}`);
    res.json(response);
  });

  /**
   * Buscar consultas
   */
  searchConsultations = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const search = req.query.search as string;

    if (!search || search.trim().length === 0) {
      throw createError('Término de búsqueda requerido', 400);
    }

    logger.info('Buscando consultas', { search });

    const consultas = await consultaRepository.searchConsultas(search);

    const response: ApiResponse<ConsultaCompleta[]> = {
      success: true,
      data: consultas
    };

    logger.info(`Resultados de búsqueda: ${consultas.length}`);
    res.json(response);
  });

  /**
   * Crear nueva consulta con archivos
   */
  createConsultationWithFiles = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const consultaData: CreateConsultaRequest = req.body;
    const files = req.files as Express.Multer.File[];

    logger.info('Creando nueva consulta con archivos', { 
      pacienteId: consultaData.paciente_id,
      fileCount: files?.length || 0
    });

    // Crear la consulta primero
    const nuevaConsulta = await consultaRepository.create(consultaData);

    // Si hay archivos, asociarlos con la consulta
    if (files && files.length > 0) {
      const fileUrls = files.map(file => `/uploads/${file.filename}`);
      
      // Actualizar la consulta con las URLs de los archivos
      // Por ahora guardamos como JSON en el campo imagen
      const updatedConsulta = await consultaRepository.update(nuevaConsulta.id, {
        imagen: JSON.stringify(fileUrls)
      });

      logger.info('Archivos asociados a la consulta', { 
        consultaId: nuevaConsulta.id,
        files: fileUrls
      });

      const response: ApiResponse<ConsultaCompleta> = {
        success: true,
        data: updatedConsulta!,
        message: `Consulta creada exitosamente con ${files.length} archivo(s)`
      };

      res.status(201).json(response);
    } else {
      const response: ApiResponse<ConsultaCompleta> = {
        success: true,
        data: nuevaConsulta,
        message: 'Consulta creada exitosamente'
      };

      res.status(201).json(response);
    }
  });
}

/**
 * Esquemas de validación para consultas
 */
export const consultationValidationSchemas = {
  create: {
    paciente_id: { required: true, type: 'number' as const },
    fecha_historia: { required: true, type: 'string' as const, pattern: /^\d{4}-\d{2}-\d{2}$/ },
    historia: { required: true, type: 'string' as const, minLength: 5, maxLength: 2000 },
    imagen: { required: false, type: 'string' as const, maxLength: 500 }
  },
  
  update: {
    paciente_id: { required: false, type: 'number' as const },
    fecha_historia: { required: false, type: 'string' as const, pattern: /^\d{4}-\d{2}-\d{2}$/ },
    historia: { required: false, type: 'string' as const, minLength: 5, maxLength: 2000 },
    imagen: { required: false, type: 'string' as const, maxLength: 500 }
  },
  
  query: {
    page: { required: false, type: 'string' as const, pattern: /^\d+$/ },
    limit: { required: false, type: 'string' as const, pattern: /^\d+$/ },
    pacienteId: { required: false, type: 'string' as const, pattern: /^\d+$/ },
    search: { required: false, type: 'string' as const, maxLength: 100 }
  }
};
