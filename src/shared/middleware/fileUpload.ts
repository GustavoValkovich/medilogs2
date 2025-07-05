import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import { createModuleLogger } from '../utils/logger';

const logger = createModuleLogger('FileUpload');

// Tipos de archivo permitidos
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.pdf'];
const MAX_FILE_SIZE = 1024 * 1024; // 1MB

// Directorio de uploads
const UPLOAD_DIR = path.join(__dirname, '../../../uploads');

// Crear directorio si no existe
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  logger.info('📁 Directorio de uploads creado:', UPLOAD_DIR);
}

// Configuración de storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    // Generar nombre único: timestamp_consultaId_originalname
    const timestamp = Date.now();
    const consultaId = req.body.consulta_id || 'temp';
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    
    // Sanitizar nombre
    const sanitizedName = name.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `${timestamp}_${consultaId}_${sanitizedName}${ext}`;
    
    cb(null, filename);
  }
});

// Validación de archivos
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const ext = path.extname(file.originalname).toLowerCase();
  
  // Validar extensión
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    logger.warn('Tipo de archivo no permitido:', { filename: file.originalname, mimetype: file.mimetype });
    return cb(new Error(`Tipo de archivo no permitido. Permitidos: ${ALLOWED_EXTENSIONS.join(', ')}`));
  }
  
  // Validar MIME type
  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    logger.warn('MIME type no permitido:', { filename: file.originalname, mimetype: file.mimetype });
    return cb(new Error(`MIME type no permitido. Permitidos: ${ALLOWED_TYPES.join(', ')}`));
  }
  
  cb(null, true);
};

// Configuración principal de multer
export const uploadConfig = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 5 // Máximo 5 archivos por consulta
  }
});

// Middleware específico para consultas
export const uploadConsultationFiles = uploadConfig.array('files', 5);

// Middleware para un solo archivo
export const uploadSingleFile = uploadConfig.single('file');

// Función para obtener información del archivo
export const getFileInfo = (file: Express.Multer.File) => {
  return {
    originalName: file.originalname,
    filename: file.filename,
    size: file.size,
    mimetype: file.mimetype,
    path: file.path,
    url: `/uploads/${file.filename}`
  };
};

// Función para eliminar archivo
export const deleteFile = (filename: string): boolean => {
  try {
    const filePath = path.join(UPLOAD_DIR, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      logger.info('🗑️ Archivo eliminado:', filename);
      return true;
    }
    return false;
  } catch (error) {
    logger.error('Error eliminando archivo:', error);
    return false;
  }
};

// Función para validar si el archivo existe
export const fileExists = (filename: string): boolean => {
  const filePath = path.join(UPLOAD_DIR, filename);
  return fs.existsSync(filePath);
};

// Constantes para exportar
export const UPLOAD_CONSTANTS = {
  ALLOWED_TYPES,
  ALLOWED_EXTENSIONS,
  MAX_FILE_SIZE,
  UPLOAD_DIR
};
