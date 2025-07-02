"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacienteController = void 0;
const paciente_db_repository_1 = require("../repositories/paciente-db.repository");
const pacienteRepository = new paciente_db_repository_1.PacienteRepository();
class PacienteController {
    async getAllPacientes(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search;
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
            res.json(response);
        }
        catch (error) {
            console.error('Error en getAllPacientes:', error);
            const response = {
                success: false,
                error: 'Error al obtener pacientes'
            };
            res.status(500).json(response);
        }
    }
    async getPacienteById(req, res) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                const response = {
                    success: false,
                    error: 'ID de paciente inválido'
                };
                res.status(400).json(response);
                return;
            }
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
            console.error('Error en getPacienteById:', error);
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
            if (!pacienteData.nombre || !pacienteData.documento || !pacienteData.nacimiento) {
                const response = {
                    success: false,
                    error: 'Nombre, documento y fecha de nacimiento son requeridos'
                };
                res.status(400).json(response);
                return;
            }
            if (pacienteData.importante && pacienteData.importante.length > 100) {
                const response = {
                    success: false,
                    error: 'El campo importante no puede exceder 100 caracteres'
                };
                res.status(400).json(response);
                return;
            }
            const pacienteExistente = await pacienteRepository.findByDocumento(pacienteData.documento);
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
            console.error('Error en createPaciente:', error);
            const response = {
                success: false,
                error: 'Error al crear paciente'
            };
            res.status(500).json(response);
        }
    }
    async updatePaciente(req, res) {
        try {
            const id = parseInt(req.params.id);
            const updateData = req.body;
            if (isNaN(id)) {
                const response = {
                    success: false,
                    error: 'ID de paciente inválido'
                };
                res.status(400).json(response);
                return;
            }
            if (updateData.importante && updateData.importante.length > 100) {
                const response = {
                    success: false,
                    error: 'El campo importante no puede exceder 100 caracteres'
                };
                res.status(400).json(response);
                return;
            }
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
            console.error('Error en updatePaciente:', error);
            const response = {
                success: false,
                error: 'Error al actualizar paciente'
            };
            res.status(500).json(response);
        }
    }
    async deletePaciente(req, res) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                const response = {
                    success: false,
                    error: 'ID de paciente inválido'
                };
                res.status(400).json(response);
                return;
            }
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
            console.error('Error en deletePaciente:', error);
            const response = {
                success: false,
                error: 'Error al eliminar paciente'
            };
            res.status(500).json(response);
        }
    }
    async getPacientesImportantes(req, res) {
        try {
            const pacientes = await pacienteRepository.getPacientesImportantes();
            const response = {
                success: true,
                data: pacientes
            };
            res.json(response);
        }
        catch (error) {
            console.error('Error en getPacientesImportantes:', error);
            const response = {
                success: false,
                error: 'Error al obtener pacientes importantes'
            };
            res.status(500).json(response);
        }
    }
    async getPacientesByMedico(req, res) {
        try {
            const medicoId = parseInt(req.params.medicoId);
            if (isNaN(medicoId)) {
                const response = {
                    success: false,
                    error: 'ID de médico inválido'
                };
                res.status(400).json(response);
                return;
            }
            const pacientes = await pacienteRepository.getPacientesByMedico(medicoId);
            const response = {
                success: true,
                data: pacientes
            };
            res.json(response);
        }
        catch (error) {
            console.error('Error en getPacientesByMedico:', error);
            const response = {
                success: false,
                error: 'Error al obtener pacientes del médico'
            };
            res.status(500).json(response);
        }
    }
}
exports.PacienteController = PacienteController;
//# sourceMappingURL=paciente-db.controller.js.map