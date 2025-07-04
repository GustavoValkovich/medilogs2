"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consultationValidationSchemas = exports.ConsultationsController = void 0;
const consulta_db_repository_1 = require("../../repositories/consulta-db.repository");
const middleware_1 = require("../../shared/middleware");
const logger_1 = require("../../shared/utils/logger");
const logger = (0, logger_1.createModuleLogger)('ConsultationsController');
const consultaRepository = new consulta_db_repository_1.ConsultaRepository();
class ConsultationsController {
    constructor() {
        this.getAllConsultations = (0, middleware_1.asyncHandler)(async (req, res) => {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const pacienteId = req.query.pacienteId ? parseInt(req.query.pacienteId) : undefined;
            logger.info('Obteniendo consultas', { page, limit, pacienteId });
            const { consultas, total } = await consultaRepository.findAll(page, limit, pacienteId);
            const response = {
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
        this.getConsultationById = (0, middleware_1.asyncHandler)(async (req, res) => {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                throw (0, middleware_1.createError)('ID de consulta inválido', 400);
            }
            logger.info('Obteniendo consulta por ID', { id });
            const consulta = await consultaRepository.findById(id);
            if (!consulta) {
                throw (0, middleware_1.createError)('Consulta no encontrada', 404);
            }
            const response = {
                success: true,
                data: consulta
            };
            res.json(response);
        });
        this.createConsultation = (0, middleware_1.asyncHandler)(async (req, res) => {
            const consultaData = req.body;
            logger.info('Creando nueva consulta', { pacienteId: consultaData.paciente_id });
            const nuevaConsulta = await consultaRepository.create(consultaData);
            const response = {
                success: true,
                data: nuevaConsulta,
                message: 'Consulta creada exitosamente'
            };
            logger.info('Consulta creada', { id: nuevaConsulta.id });
            res.status(201).json(response);
        });
        this.updateConsultation = (0, middleware_1.asyncHandler)(async (req, res) => {
            const id = parseInt(req.params.id);
            const updateData = req.body;
            if (isNaN(id)) {
                throw (0, middleware_1.createError)('ID de consulta inválido', 400);
            }
            logger.info('Actualizando consulta', { id });
            const consultaActualizada = await consultaRepository.update(id, updateData);
            if (!consultaActualizada) {
                throw (0, middleware_1.createError)('Consulta no encontrada', 404);
            }
            const response = {
                success: true,
                data: consultaActualizada,
                message: 'Consulta actualizada exitosamente'
            };
            logger.info('Consulta actualizada', { id });
            res.json(response);
        });
        this.deleteConsultation = (0, middleware_1.asyncHandler)(async (req, res) => {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                throw (0, middleware_1.createError)('ID de consulta inválido', 400);
            }
            logger.info('Eliminando consulta', { id });
            const eliminada = await consultaRepository.delete(id);
            if (!eliminada) {
                throw (0, middleware_1.createError)('Consulta no encontrada', 404);
            }
            const response = {
                success: true,
                data: null,
                message: 'Consulta eliminada exitosamente'
            };
            logger.info('Consulta eliminada', { id });
            res.json(response);
        });
        this.getConsultationsByPatient = (0, middleware_1.asyncHandler)(async (req, res) => {
            const pacienteId = parseInt(req.params.pacienteId);
            if (isNaN(pacienteId)) {
                throw (0, middleware_1.createError)('ID de paciente inválido', 400);
            }
            logger.info('Obteniendo consultas por paciente', { pacienteId });
            const consultas = await consultaRepository.findByPacienteId(pacienteId);
            const response = {
                success: true,
                data: consultas
            };
            logger.info(`Consultas del paciente ${pacienteId}: ${consultas.length}`);
            res.json(response);
        });
        this.getRecentConsultations = (0, middleware_1.asyncHandler)(async (req, res) => {
            const limit = parseInt(req.query.limit) || 10;
            logger.info('Obteniendo últimas consultas', { limit });
            const consultas = await consultaRepository.getUltimasConsultas(limit);
            const response = {
                success: true,
                data: consultas
            };
            logger.info(`Últimas consultas obtenidas: ${consultas.length}`);
            res.json(response);
        });
        this.searchConsultations = (0, middleware_1.asyncHandler)(async (req, res) => {
            const search = req.query.search;
            if (!search || search.trim().length === 0) {
                throw (0, middleware_1.createError)('Término de búsqueda requerido', 400);
            }
            logger.info('Buscando consultas', { search });
            const consultas = await consultaRepository.searchConsultas(search);
            const response = {
                success: true,
                data: consultas
            };
            logger.info(`Resultados de búsqueda: ${consultas.length}`);
            res.json(response);
        });
    }
}
exports.ConsultationsController = ConsultationsController;
exports.consultationValidationSchemas = {
    create: {
        paciente_id: { required: true, type: 'number' },
        fecha_historia: { required: true, type: 'string', pattern: /^\d{4}-\d{2}-\d{2}$/ },
        historia: { required: true, type: 'string', minLength: 5, maxLength: 2000 },
        imagen: { required: false, type: 'string', maxLength: 500 }
    },
    update: {
        paciente_id: { required: false, type: 'number' },
        fecha_historia: { required: false, type: 'string', pattern: /^\d{4}-\d{2}-\d{2}$/ },
        historia: { required: false, type: 'string', minLength: 5, maxLength: 2000 },
        imagen: { required: false, type: 'string', maxLength: 500 }
    },
    query: {
        page: { required: false, type: 'string', pattern: /^\d+$/ },
        limit: { required: false, type: 'string', pattern: /^\d+$/ },
        pacienteId: { required: false, type: 'string', pattern: /^\d+$/ },
        search: { required: false, type: 'string', maxLength: 100 }
    }
};
//# sourceMappingURL=consultations.controller.js.map