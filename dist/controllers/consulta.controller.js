"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultaController = void 0;
const consulta_repository_1 = require("../repositories/consulta.repository");
const types_1 = require("../types");
const consultaRepository = new consulta_repository_1.ConsultaRepository();
class ConsultaController {
    async getAllConsultas(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const pacienteId = req.query.pacienteId;
            const estado = req.query.estado;
            const fechaInicio = req.query.fechaInicio;
            const fechaFin = req.query.fechaFin;
            let consultas = await consultaRepository.findAll();
            if (pacienteId) {
                consultas = await consultaRepository.findByPacienteId(pacienteId);
            }
            if (estado) {
                consultas = consultas.filter(c => c.estado === estado);
            }
            if (fechaInicio && fechaFin) {
                const inicio = new Date(fechaInicio);
                const fin = new Date(fechaFin);
                consultas = consultas.filter(c => c.fecha >= inicio && c.fecha <= fin);
            }
            consultas.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const paginatedConsultas = consultas.slice(startIndex, endIndex);
            const response = {
                success: true,
                data: {
                    data: paginatedConsultas,
                    total: consultas.length,
                    page,
                    limit,
                    totalPages: Math.ceil(consultas.length / limit)
                }
            };
            res.json(response);
        }
        catch (error) {
            const response = {
                success: false,
                error: 'Error al obtener consultas'
            };
            res.status(500).json(response);
        }
    }
    async getConsultaById(req, res) {
        try {
            const { id } = req.params;
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
            if (!consultaData.pacienteId || !consultaData.fecha || !consultaData.motivo || !consultaData.medico) {
                const response = {
                    success: false,
                    error: 'PacienteId, fecha, motivo y médico son requeridos'
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
            const response = {
                success: false,
                error: 'Error al crear consulta'
            };
            res.status(500).json(response);
        }
    }
    async updateConsulta(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
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
            const response = {
                success: false,
                error: 'Error al actualizar consulta'
            };
            res.status(500).json(response);
        }
    }
    async deleteConsulta(req, res) {
        try {
            const { id } = req.params;
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
            const response = {
                success: false,
                error: 'Error al eliminar consulta'
            };
            res.status(500).json(response);
        }
    }
    async getConsultasByPaciente(req, res) {
        try {
            const { pacienteId } = req.params;
            const consultas = await consultaRepository.findByPacienteId(pacienteId);
            consultas.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
            const response = {
                success: true,
                data: consultas
            };
            res.json(response);
        }
        catch (error) {
            const response = {
                success: false,
                error: 'Error al obtener consultas del paciente'
            };
            res.status(500).json(response);
        }
    }
    async cambiarEstadoConsulta(req, res) {
        try {
            const { id } = req.params;
            const { estado } = req.body;
            if (!Object.values(types_1.EstadoConsulta).includes(estado)) {
                const response = {
                    success: false,
                    error: 'Estado de consulta inválido'
                };
                res.status(400).json(response);
                return;
            }
            const consultaActualizada = await consultaRepository.updateEstado(id, estado);
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
                message: `Estado de consulta cambiado a ${estado}`
            };
            res.json(response);
        }
        catch (error) {
            const response = {
                success: false,
                error: 'Error al cambiar estado de consulta'
            };
            res.status(500).json(response);
        }
    }
}
exports.ConsultaController = ConsultaController;
//# sourceMappingURL=consulta.controller.js.map