"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidationSchemas = exports.AuthController = void 0;
const medico_db_repository_1 = require("../../repositories/medico-db.repository");
const middleware_1 = require("../../shared/middleware");
const logger_1 = require("../../shared/utils/logger");
const logger = (0, logger_1.createModuleLogger)('AuthController');
const medicoRepository = new medico_db_repository_1.MedicoRepository();
class AuthController {
    constructor() {
        this.login = (0, middleware_1.asyncHandler)(async (req, res) => {
            const { email, password } = req.body;
            logger.info('Intento de login', { email });
            const medico = await medicoRepository.validatePassword(email, password);
            if (!medico) {
                logger.warn('Login fallido: credenciales inválidas', { email });
                throw (0, middleware_1.createError)('Credenciales inválidas', 401);
            }
            const sessionData = {
                id: medico.id,
                email: medico.email,
                nombre: medico.nombre
            };
            const response = {
                success: true,
                data: {
                    medico: sessionData,
                    message: 'Login exitoso'
                }
            };
            logger.info('Login exitoso', { email, medicoId: medico.id });
            res.json(response);
        });
        this.logout = (0, middleware_1.asyncHandler)(async (req, res) => {
            logger.info('Logout de usuario');
            const response = {
                success: true,
                data: null,
                message: 'Logout exitoso'
            };
            res.json(response);
        });
        this.getCurrentUser = (0, middleware_1.asyncHandler)(async (req, res) => {
            const response = {
                success: false,
                message: 'Función no implementada - requiere middleware de autenticación'
            };
            res.status(501).json(response);
        });
    }
    async verifyPassword(plainPassword, hashedPassword) {
        return plainPassword === hashedPassword;
    }
}
exports.AuthController = AuthController;
exports.authValidationSchemas = {
    login: {
        email: { required: true, type: 'string', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
        password: { required: true, type: 'string', minLength: 1 }
    }
};
//# sourceMappingURL=auth.controller.js.map