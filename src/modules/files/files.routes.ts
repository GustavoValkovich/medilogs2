import { Router } from 'express';
import { FilesController } from './files.controller';
import { requestLogger, multerErrorHandler } from '../../shared/middleware';

const router = Router();
const filesController = new FilesController();

// Aplicar logging a todas las rutas
router.use(requestLogger);

/**
 * @route GET /api/files/info
 * @desc Obtener información sobre tipos de archivo permitidos
 * @access Public
 */
router.get('/info', filesController.getUploadInfo);

/**
 * @route POST /api/files/upload
 * @desc Subir un archivo individual
 * @access Public
 * @body FormData con campo 'file'
 */
router.post('/upload', filesController.uploadSingleFile);

/**
 * @route POST /api/files/upload/consultation
 * @desc Subir múltiples archivos para una consulta
 * @access Public
 * @body FormData con campo 'files' (múltiple)
 */
router.post('/upload/consultation', filesController.uploadConsultationFiles);

/**
 * @route DELETE /api/files/:filename
 * @desc Eliminar un archivo
 * @access Public
 */
router.delete('/:filename', filesController.deleteFile);

/**
 * @route GET /api/files/check/:filename
 * @desc Verificar si un archivo existe
 * @access Public
 */
router.get('/check/:filename', filesController.checkFile);

// Middleware de manejo de errores de multer
router.use(multerErrorHandler);

export { router as filesRouter };
