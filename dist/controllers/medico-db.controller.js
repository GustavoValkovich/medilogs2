"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicoController = void 0;
const medico_db_repository_1 = require("../repositories/medico-db.repository");
class MedicoController {
    constructor() {
        this.medicoRepository = new medico_db_repository_1.MedicoRepository();
    }
    async getAllMedicos(req, res) {
        try {
            const medicos = await this.medicoRepository.findAll();
            res.json({
                success: true,
                count: medicos.length,
                data: medicos
            });
        }
        catch (error) {
            console.error('Error obteniendo médicos:', error);
            res.status(500).json({
                success: false,
                error: 'Error obteniendo médicos'
            });
        }
    }
    async getMedicoById(req, res) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    error: 'ID de médico inválido'
                });
                return;
            }
            const medico = await this.medicoRepository.findById(id);
            if (!medico) {
                res.status(404).json({
                    success: false,
                    error: 'Médico no encontrado'
                });
                return;
            }
            res.json({
                success: true,
                data: medico
            });
        }
        catch (error) {
            console.error('Error obteniendo médico:', error);
            res.status(500).json({
                success: false,
                error: 'Error obteniendo médico'
            });
        }
    }
    async createMedico(req, res) {
        try {
            const { nombre, email, password } = req.body;
            if (!nombre || !email || !password) {
                res.status(400).json({
                    success: false,
                    error: 'Faltan campos requeridos: nombre, email, password'
                });
                return;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                res.status(400).json({
                    success: false,
                    error: 'Formato de email inválido'
                });
                return;
            }
            const existingMedico = await this.medicoRepository.findByEmail(email);
            if (existingMedico) {
                res.status(409).json({
                    success: false,
                    error: 'Ya existe un médico con ese email'
                });
                return;
            }
            const nuevoMedico = await this.medicoRepository.create({
                nombre,
                email,
                password
            });
            res.status(201).json({
                success: true,
                message: 'Médico creado exitosamente',
                data: nuevoMedico
            });
        }
        catch (error) {
            console.error('Error creando médico:', error);
            res.status(500).json({
                success: false,
                error: 'Error creando médico'
            });
        }
    }
    async updateMedico(req, res) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    error: 'ID de médico inválido'
                });
                return;
            }
            const { nombre, email, password } = req.body;
            if (!nombre && !email && !password) {
                res.status(400).json({
                    success: false,
                    error: 'No se proporcionaron campos para actualizar'
                });
                return;
            }
            if (email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    res.status(400).json({
                        success: false,
                        error: 'Formato de email inválido'
                    });
                    return;
                }
                const existingMedico = await this.medicoRepository.findByEmail(email);
                if (existingMedico && existingMedico.id !== id) {
                    res.status(409).json({
                        success: false,
                        error: 'Ya existe otro médico con ese email'
                    });
                    return;
                }
            }
            const updateData = {};
            if (nombre)
                updateData.nombre = nombre;
            if (email)
                updateData.email = email;
            if (password)
                updateData.password = password;
            const medicoActualizado = await this.medicoRepository.update(id, updateData);
            if (!medicoActualizado) {
                res.status(404).json({
                    success: false,
                    error: 'Médico no encontrado'
                });
                return;
            }
            res.json({
                success: true,
                message: 'Médico actualizado exitosamente',
                data: medicoActualizado
            });
        }
        catch (error) {
            console.error('Error actualizando médico:', error);
            res.status(500).json({
                success: false,
                error: 'Error actualizando médico'
            });
        }
    }
    async deleteMedico(req, res) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    error: 'ID de médico inválido'
                });
                return;
            }
            const eliminado = await this.medicoRepository.delete(id);
            if (!eliminado) {
                res.status(404).json({
                    success: false,
                    error: 'Médico no encontrado'
                });
                return;
            }
            res.json({
                success: true,
                message: 'Médico eliminado exitosamente'
            });
        }
        catch (error) {
            console.error('Error eliminando médico:', error);
            if (error instanceof Error && error.message.includes('pacientes asignados')) {
                res.status(400).json({
                    success: false,
                    error: error.message
                });
                return;
            }
            res.status(500).json({
                success: false,
                error: 'Error eliminando médico'
            });
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).json({
                    success: false,
                    error: 'Email y password son requeridos'
                });
                return;
            }
            const medico = await this.medicoRepository.validatePassword(email, password);
            if (!medico) {
                res.status(401).json({
                    success: false,
                    error: 'Email o password incorrectos'
                });
                return;
            }
            res.json({
                success: true,
                message: 'Login exitoso',
                data: {
                    medico,
                }
            });
        }
        catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({
                success: false,
                error: 'Error en el proceso de login'
            });
        }
    }
}
exports.MedicoController = MedicoController;
//# sourceMappingURL=medico-db.controller.js.map