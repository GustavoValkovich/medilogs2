"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorValidationSchemas = exports.DoctorsController = void 0;
const medico_db_repository_1 = require("../../repositories/medico-db.repository");
const middleware_1 = require("../../shared/middleware");
const logger_1 = require("../../shared/utils/logger");
const logger = (0, logger_1.createModuleLogger)('DoctorsController');
const medicoRepository = new medico_db_repository_1.MedicoRepository();
class DoctorsController {
    constructor() {
        this.getAllDoctors = (0, middleware_1.asyncHandler)(async (req, res) => {
            logger.info('Obteniendo todos los médicos');
            const medicos = await medicoRepository.findAll();
            const response = {
                success: true,
                data: medicos,
                message: `${medicos.length} médicos encontrados`
            };
            logger.info(`Médicos obtenidos: ${medicos.length}`);
            res.json(response);
        });
        this.getDoctorById = (0, middleware_1.asyncHandler)(async (req, res) => {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                throw (0, middleware_1.createError)('ID de médico inválido', 400);
            }
            logger.info('Obteniendo médico por ID', { id });
            const medico = await medicoRepository.findById(id);
            if (!medico) {
                throw (0, middleware_1.createError)('Médico no encontrado', 404);
            }
            const response = {
                success: true,
                data: medico
            };
            res.json(response);
        });
        this.createDoctor = (0, middleware_1.asyncHandler)(async (req, res) => {
            const medicoData = req.body;
            logger.info('Creando nuevo médico', { nombre: medicoData.nombre });
            const nuevoMedico = await medicoRepository.create(medicoData);
            const response = {
                success: true,
                data: nuevoMedico,
                message: 'Médico creado exitosamente'
            };
            logger.info('Médico creado', { id: nuevoMedico.id });
            res.status(201).json(response);
        });
        this.updateDoctor = (0, middleware_1.asyncHandler)(async (req, res) => {
            const id = parseInt(req.params.id);
            const updateData = req.body;
            if (isNaN(id)) {
                throw (0, middleware_1.createError)('ID de médico inválido', 400);
            }
            logger.info('Actualizando médico', { id });
            const medicoActualizado = await medicoRepository.update(id, updateData);
            if (!medicoActualizado) {
                throw (0, middleware_1.createError)('Médico no encontrado', 404);
            }
            const response = {
                success: true,
                data: medicoActualizado,
                message: 'Médico actualizado exitosamente'
            };
            logger.info('Médico actualizado', { id });
            res.json(response);
        });
        this.deleteDoctor = (0, middleware_1.asyncHandler)(async (req, res) => {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                throw (0, middleware_1.createError)('ID de médico inválido', 400);
            }
            logger.info('Eliminando médico', { id });
            const eliminado = await medicoRepository.delete(id);
            if (!eliminado) {
                throw (0, middleware_1.createError)('Médico no encontrado', 404);
            }
            const response = {
                success: true,
                data: null,
                message: 'Médico eliminado exitosamente'
            };
            logger.info('Médico eliminado', { id });
            res.json(response);
        });
    }
}
exports.DoctorsController = DoctorsController;
exports.doctorValidationSchemas = {
    create: {
        nombre: { required: true, type: 'string', minLength: 2, maxLength: 100 },
        apellido: { required: true, type: 'string', minLength: 2, maxLength: 100 },
        especialidad: { required: true, type: 'string', minLength: 2, maxLength: 100 },
        telefono: { required: false, type: 'string', maxLength: 20 },
        email: { required: false, type: 'string', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
        matricula: { required: true, type: 'string', minLength: 3, maxLength: 50 },
        password: { required: true, type: 'string', minLength: 6 }
    },
    update: {
        nombre: { required: false, type: 'string', minLength: 2, maxLength: 100 },
        apellido: { required: false, type: 'string', minLength: 2, maxLength: 100 },
        especialidad: { required: false, type: 'string', minLength: 2, maxLength: 100 },
        telefono: { required: false, type: 'string', maxLength: 20 },
        email: { required: false, type: 'string', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
        matricula: { required: false, type: 'string', minLength: 3, maxLength: 50 },
        password: { required: false, type: 'string', minLength: 6 }
    }
};
//# sourceMappingURL=doctors.controller.js.map