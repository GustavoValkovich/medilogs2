"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultaController = void 0;
const consulta_db_repository_1 = require("../repositories/consulta-db.repository");
const consultaRepository = new consulta_db_repository_1.ConsultaRepository();
class ConsultaController {
    async getAllConsultas(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const pacienteId = req.query.pacienteId ? parseInt(req.query.pacienteId) : undefined;
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
            res.json(response);
        }
        catch (error) {
            console.error('Error en getAllConsultas:', error);
            const response = {
                success: false,
                error: 'Error al obtener consultas'
            };
            res.status(500).json(response);
        }
    }
    async getConsultaById(req, res) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                const response = {
                    success: false,
                    error: 'ID de consulta inválido'
                };
                res.status(400).json(response);
                return;
            }
            const consulta = await consultaRepository.findById(id);
            if (!consulta) {
                const response = {
                    success: false,
                    error: 'Consulta no encontrada'
                };
                res.status(404).json(response);
                return;
            }
            const response = {
                success: true,
                data: consulta
            };
            res.json(response);
        }
        catch (error) {
            console.error('Error en getConsultaById:', error);
            const response = {
                success: false,
                error: 'Error al obtener consulta'
            };
            res.status(500).json(response);
        }
    }
    async createConsulta(req, res) {
        try {
            const consultaData = req.body;
            if (!consultaData.paciente_id || !consultaData.fecha_historia || !consultaData.historia) {
                const response = {
                    success: false,
                    error: 'Paciente ID, fecha de historia y historia son requeridos'
                };
                res.status(400).json(response);
                return;
            }
            const nuevaConsulta = await consultaRepository.create(consultaData);
            const response = {
                success: true,
                data: nuevaConsulta,
                message: 'Consulta creada exitosamente'
            };
            res.status(201).json(response);
        }
        catch (error) {
            console.error('Error en createConsulta:', error);
            const response = {
                success: false,
                error: 'Error al crear consulta'
            };
            res.status(500).json(response);
        }
    }
    async updateConsulta(req, res) {
        try {
            const id = parseInt(req.params.id);
            const updateData = req.body;
            if (isNaN(id)) {
                const response = {
                    success: false,
                    error: 'ID de consulta inválido'
                };
                res.status(400).json(response);
                return;
            }
            const consultaActualizada = await consultaRepository.update(id, updateData);
            if (!consultaActualizada) {
                const response = {
                    success: false,
                    error: 'Consulta no encontrada'
                };
                res.status(404).json(response);
                return;
            }
            const response = {
                success: true,
                data: consultaActualizada,
                message: 'Consulta actualizada exitosamente'
            };
            res.json(response);
        }
        catch (error) {
            console.error('Error en updateConsulta:', error);
            const response = {
                success: false,
                error: 'Error al actualizar consulta'
            };
            res.status(500).json(response);
        }
    }
    async deleteConsulta(req, res) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                const response = {
                    success: false,
                    error: 'ID de consulta inválido'
                };
                res.status(400).json(response);
                return;
            }
            const eliminada = await consultaRepository.delete(id);
            if (!eliminada) {
                const response = {
                    success: false,
                    error: 'Consulta no encontrada'
                };
                res.status(404).json(response);
                return;
            }
            const response = {
                success: true,
                message: 'Consulta eliminada exitosamente'
            };
            res.json(response);
        }
        catch (error) {
            console.error('Error en deleteConsulta:', error);
            const response = {
                success: false,
                error: 'Error al eliminar consulta'
            };
            res.status(500).json(response);
        }
    }
    async getConsultasByPaciente(req, res) {
        try {
            const pacienteId = parseInt(req.params.pacienteId);
            if (isNaN(pacienteId)) {
                const response = {
                    success: false,
                    error: 'ID de paciente inválido'
                };
                res.status(400).json(response);
                return;
            }
            const consultas = await consultaRepository.findByPacienteId(pacienteId);
            const response = {
                success: true,
                data: consultas
            };
            res.json(response);
        }
        catch (error) {
            console.error('Error en getConsultasByPaciente:', error);
            const response = {
                success: false,
                error: 'Error al obtener consultas del paciente'
            };
            res.status(500).json(response);
        }
    }
    async getUltimasConsultas(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const consultas = await consultaRepository.getUltimasConsultas(limit);
            const response = {
                success: true,
                data: consultas
            };
            res.json(response);
        }
        catch (error) {
            console.error('Error en getUltimasConsultas:', error);
            const response = {
                success: false,
                error: 'Error al obtener últimas consultas'
            };
            res.status(500).json(response);
        }
    }
    async searchConsultas(req, res) {
        try {
            const searchTerm = req.query.q;
            if (!searchTerm) {
                const response = {
                    success: false,
                    error: 'Término de búsqueda requerido'
                };
                res.status(400).json(response);
                return;
            }
            const consultas = await consultaRepository.searchConsultas(searchTerm);
            const response = {
                success: true,
                data: consultas
            };
            res.json(response);
        }
        catch (error) {
            console.error('Error en searchConsultas:', error);
            const response = {
                success: false,
                error: 'Error al buscar consultas'
            };
            res.status(500).json(response);
        }
    }
}
exports.ConsultaController = ConsultaController;
//# sourceMappingURL=consulta-db.controller.js.map