"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const consulta_controller_1 = require("../controllers/consulta.controller");
const router = (0, express_1.Router)();
const consultaController = new consulta_controller_1.ConsultaController();
router.get('/', consultaController.getAllConsultas.bind(consultaController));
router.get('/:id', consultaController.getConsultaById.bind(consultaController));
router.post('/', consultaController.createConsulta.bind(consultaController));
router.put('/:id', consultaController.updateConsulta.bind(consultaController));
router.delete('/:id', consultaController.deleteConsulta.bind(consultaController));
router.get('/paciente/:pacienteId', consultaController.getConsultasByPaciente.bind(consultaController));
router.patch('/:id/estado', consultaController.cambiarEstadoConsulta.bind(consultaController));
exports.default = router;
//# sourceMappingURL=consultas.js.map