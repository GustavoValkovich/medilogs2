import { Request, Response } from 'express';
import { 
  asyncHandler, 
  createError, 
  uploadSingleFile, 
  uploadConsultationFiles, 
  getFileInfo, 
  deleteFile, 
  fileExists,
  UPLOAD_CONSTANTS 
} from '../../shared/middleware';
import { createModuleLogger } from '../../shared/utils/logger';
import { ApiResponse } from '../../types/database';

const logger = createModuleLogger('FilesController');

export interface FileUploadResponse {
  filename: string;
  originalName: string;
  size: number;
  mimetype: string;
  url: string;
}

export interface MultipleFileUploadResponse {
  files: FileUploadResponse[];
  totalFiles: number;
  totalSize: number;
}

/**
 * Controlador para manejo de archivos
 */
export class FilesController {

  /**
   * Obtener información sobre los tipos de archivo permitidos
   */
  getUploadInfo = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const response: ApiResponse<typeof UPLOAD_CONSTANTS> = {
      success: true,
      data: UPLOAD_CONSTANTS,
      message: 'Información de upload obtenida exitosamente'
    };

    res.json(response);
  });

  /**
   * Subir un archivo individual
   */
  uploadSingleFile = [
    uploadSingleFile,
    asyncHandler(async (req: Request, res: Response): Promise<void> => {
      const file = req.file;
      
      if (!file) {
        throw createError('No se proporcionó ningún archivo', 400);
      }

      const fileInfo = getFileInfo(file);
      logger.info('Archivo subido exitosamente:', fileInfo);

      const response: ApiResponse<FileUploadResponse> = {
        success: true,
        data: {
          filename: fileInfo.filename,
          originalName: fileInfo.originalName,
          size: fileInfo.size,
          mimetype: fileInfo.mimetype,
          url: fileInfo.url
        },
        message: 'Archivo subido exitosamente'
      };

      res.status(201).json(response);
    })
  ];

  /**
   * Subir múltiples archivos para una consulta
   */
  uploadConsultationFiles = [
    uploadConsultationFiles,
    asyncHandler(async (req: Request, res: Response): Promise<void> => {
      const files = req.files as Express.Multer.File[];
      
      if (!files || files.length === 0) {
        throw createError('No se proporcionaron archivos', 400);
      }

      const fileInfos = files.map(file => getFileInfo(file));
      const totalSize = files.reduce((total, file) => total + file.size, 0);

      logger.info('Archivos subidos exitosamente:', {
        count: files.length,
        totalSize,
        files: fileInfos.map(f => f.filename)
      });

      const response: ApiResponse<MultipleFileUploadResponse> = {
        success: true,
        data: {
          files: fileInfos.map(fileInfo => ({
            filename: fileInfo.filename,
            originalName: fileInfo.originalName,
            size: fileInfo.size,
            mimetype: fileInfo.mimetype,
            url: fileInfo.url
          })),
          totalFiles: files.length,
          totalSize
        },
        message: `${files.length} archivo(s) subido(s) exitosamente`
      };

      res.status(201).json(response);
    })
  ];

  /**
   * Eliminar un archivo
   */
  deleteFile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { filename } = req.params;

    if (!filename) {
      throw createError('Nombre de archivo requerido', 400);
    }

    // Verificar si el archivo existe
    if (!fileExists(filename)) {
      throw createError('Archivo no encontrado', 404);
    }

    // Eliminar el archivo
    const deleted = deleteFile(filename);

    if (!deleted) {
      throw createError('Error eliminando el archivo', 500);
    }

    logger.info('Archivo eliminado:', filename);

    const response: ApiResponse<null> = {
      success: true,
      data: null,
      message: 'Archivo eliminado exitosamente'
    };

    res.json(response);
  });

  /**
   * Verificar si un archivo existe
   */
  checkFile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { filename } = req.params;

    if (!filename) {
      throw createError('Nombre de archivo requerido', 400);
    }

    const exists = fileExists(filename);

    const response: ApiResponse<{ exists: boolean; filename: string }> = {
      success: true,
      data: {
        exists,
        filename
      },
      message: exists ? 'Archivo encontrado' : 'Archivo no encontrado'
    };

    res.json(response);
  });
}
