"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patientValidationSchemas = exports.PatientsController = void 0;
const paciente_db_repository_1 = require("../../repositories/paciente-db.repository");
const middleware_1 = require("../../shared/middleware");
const logger_1 = require("../../shared/utils/logger");
const logger = (0, logger_1.createModuleLogger)('PatientsController');
const pacienteRepository = new paciente_db_repository_1.PacienteRepository();
class PatientsController {
    constructor() {
        this.getAllPatients = (0, middleware_1.asyncHandler)(async (req, res) => {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search;
            logger.info('Obteniendo pacientes', { page, limit, search });
            const { pacientes, total } = await pacienteRepository.findAll(page, limit, search);
            const response = {
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
        this.getPatientById = (0, middleware_1.asyncHandler)(async (req, res) => {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                throw (0, middleware_1.createError)('ID de paciente inválido', 400);
            }
            logger.info('Obteniendo paciente por ID', { id });
            const paciente = await pacienteRepository.findById(id);
            if (!paciente) {
                throw (0, middleware_1.createError)('Paciente no encontrado', 404);
            }
            const response = {
                success: true,
                data: paciente
            };
            res.json(response);
        });
        this.createPatient = (0, middleware_1.asyncHandler)(async (req, res) => {
            const pacienteData = req.body;
            logger.info('Creando nuevo paciente', { nombre: pacienteData.nombre });
            const nuevoPaciente = await pacienteRepository.create(pacienteData);
            const response = {
                success: true,
                data: nuevoPaciente,
                message: 'Paciente creado exitosamente'
            };
            logger.info('Paciente creado', { id: nuevoPaciente.id });
            res.status(201).json(response);
        });
        this.updatePatient = (0, middleware_1.asyncHandler)(async (req, res) => {
            const id = parseInt(req.params.id);
            const updateData = req.body;
            if (isNaN(id)) {
                throw (0, middleware_1.createError)('ID de paciente inválido', 400);
            }
            logger.info('Actualizando paciente', { id });
            const pacienteActualizado = await pacienteRepository.update(id, updateData);
            if (!pacienteActualizado) {
                throw (0, middleware_1.createError)('Paciente no encontrado', 404);
            }
            const response = {
                success: true,
                data: pacienteActualizado,
                message: 'Paciente actualizado exitosamente'
            };
            logger.info('Paciente actualizado', { id });
            res.json(response);
        });
        this.deletePatient = (0, middleware_1.asyncHandler)(async (req, res) => {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                throw (0, middleware_1.createError)('ID de paciente inválido', 400);
            }
            logger.info('Eliminando paciente', { id });
            const eliminado = await pacienteRepository.delete(id);
            if (!eliminado) {
                throw (0, middleware_1.createError)('Paciente no encontrado', 404);
            }
            const response = {
                success: true,
                data: null,
                message: 'Paciente eliminado exitosamente'
            };
            logger.info('Paciente eliminado', { id });
            res.json(response);
        });
        this.getImportantPatients = (0, middleware_1.asyncHandler)(async (req, res) => {
            logger.info('Obteniendo pacientes importantes');
            const pacientes = await pacienteRepository.getPacientesImportantes();
            const response = {
                success: true,
                data: pacientes
            };
            logger.info(`Pacientes importantes obtenidos: ${pacientes.length}`);
            res.json(response);
        });
        this.getPatientsByDoctor = (0, middleware_1.asyncHandler)(async (req, res) => {
            const medicoId = parseInt(req.params.medicoId);
            if (isNaN(medicoId)) {
                throw (0, middleware_1.createError)('ID de médico inválido', 400);
            }
            logger.info('Obteniendo pacientes por médico', { medicoId });
            const pacientes = await pacienteRepository.getPacientesByMedico(medicoId);
            const response = {
                success: true,
                data: pacientes
            };
            logger.info(`Pacientes del médico ${medicoId}: ${pacientes.length}`);
            res.json(response);
        });
    }
}
exports.PatientsController = PatientsController;
exports.patientValidationSchemas = {
    create: {
        nombre: { required: true, type: 'string', minLength: 2, maxLength: 100 },
        documento: { required: true, type: 'string', minLength: 5, maxLength: 20 },
        nacimiento: { required: true, type: 'string', pattern: /^\d{4}-\d{2}-\d{2}$/ },
        sexo: { required: false, type: 'string', values: ['M', 'F', 'O'] },
        obra_social: { required: false, type: 'string', maxLength: 100 },
        mail: { required: false, type: 'string', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
        medico_id: { required: false, type: 'number' },
        importante: { required: false, type: 'string', maxLength: 200 }
    },
    update: {
        nombre: { required: false, type: 'string', minLength: 2, maxLength: 100 },
        documento: { required: false, type: 'string', minLength: 5, maxLength: 20 },
        nacimiento: { required: false, type: 'string', pattern: /^\d{4}-\d{2}-\d{2}$/ },
        sexo: { required: false, type: 'string', values: ['M', 'F', 'O'] },
        obra_social: { required: false, type: 'string', maxLength: 100 },
        mail: { required: false, type: 'string', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
        medico_id: { required: false, type: 'number' },
        importante: { required: false, type: 'string', maxLength: 200 }
    },
    query: {
        page: { required: false, type: 'string', pattern: /^\d+$/ },
        limit: { required: false, type: 'string', pattern: /^\d+$/ },
        search: { required: false, type: 'string', maxLength: 100 }
    }
};
//# sourceMappingURL=patients.controller.js.map