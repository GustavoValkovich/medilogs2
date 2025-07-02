"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacienteController = void 0;
const paciente_repository_1 = require("../repositories/paciente.repository");
const pacienteRepository = new paciente_repository_1.PacienteRepository();
class PacienteController {
    async getAllPacientes(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search;
            let pacientes = await pacienteRepository.findAll();
            if (search) {
                pacientes = pacientes.filter(p => p.nombre.toLowerCase().includes(search.toLowerCase()) ||
                    p.apellido.toLowerCase().includes(search.toLowerCase()) ||
                    p.numeroDocumento.includes(search));
            }
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const paginatedPacientes = pacientes.slice(startIndex, endIndex);
            const response = {
                success: true,
                data: {
                    data: paginatedPacientes,
                    total: pacientes.length,
                    page,
                    limit,
                    totalPages: Math.ceil(pacientes.length / limit)
                }
            };
            res.json(response);
        }
        catch (error) {
            const response = {
                success: false,
                error: 'Error al obtener pacientes'
            };
            res.status(500).json(response);
        }
    }
    async getPacienteById(req, res) {
        try {
            const { id } = req.params;
            const paciente = await pacienteRepository.findById(id);
            if (!paciente) {
                const response = {
                    success: false,
                    error: 'Paciente no encontrado'
                };
                res.status(404).json(response);
                return;
            }
            const response = {
                success: true,
                data: paciente
            };
            res.json(response);
        }
        catch (error) {
            const response = {
                success: false,
                error: 'Error al obtener paciente'
            };
            res.status(500).json(response);
        }
    }
    async createPaciente(req, res) {
        try {
            const pacienteData = req.body;
            if (!pacienteData.nombre || !pacienteData.apellido || !pacienteData.numeroDocumento) {
                const response = {
                    success: false,
                    error: 'Nombre, apellido y número de documento son requeridos'
                };
                res.status(400).json(response);
                return;
            }
            const pacienteExistente = await pacienteRepository.findByDocumento(pacienteData.numeroDocumento);
            if (pacienteExistente) {
                const response = {
                    success: false,
                    error: 'Ya existe un paciente con ese número de documento'
                };
                res.status(409).json(response);
                return;
            }
            const nuevoPaciente = await pacienteRepository.create(pacienteData);
            const response = {
                success: true,
                data: nuevoPaciente,
                message: 'Paciente creado exitosamente'
            };
            res.status(201).json(response);
        }
        catch (error) {
            const response = {
                success: false,
                error: 'Error al crear paciente'
            };
            res.status(500).json(response);
        }
    }
    async updatePaciente(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const pacienteActualizado = await pacienteRepository.update(id, updateData);
            if (!pacienteActualizado) {
                const response = {
                    success: false,
                    error: 'Paciente no encontrado'
                };
                res.status(404).json(response);
                return;
            }
            const response = {
                success: true,
                data: pacienteActualizado,
                message: 'Paciente actualizado exitosamente'
            };
            res.json(response);
        }
        catch (error) {
            const response = {
                success: false,
                error: 'Error al actualizar paciente'
            };
            res.status(500).json(response);
        }
    }
    async deletePaciente(req, res) {
        try {
            const { id } = req.params;
            const eliminado = await pacienteRepository.delete(id);
            if (!eliminado) {
                const response = {
                    success: false,
                    error: 'Paciente no encontrado'
                };
                res.status(404).json(response);
                return;
            }
            const response = {
                success: true,
                message: 'Paciente eliminado exitosamente'
            };
            res.json(response);
        }
        catch (error) {
            const response = {
                success: false,
                error: 'Error al eliminar paciente'
            };
            res.status(500).json(response);
        }
    }
}
exports.PacienteController = PacienteController;
//# sourceMappingURL=paciente.controller.js.map