"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paciente_controller_1 = require("../controllers/paciente.controller");
const consulta_controller_1 = require("../controllers/consulta.controller");
const router = (0, express_1.Router)();
const pacienteController = new paciente_controller_1.PacienteController();
const consultaController = new consulta_controller_1.ConsultaController();
router.get('/', pacienteController.getAllPacientes.bind(pacienteController));
router.get('/:id/consultas', consultaController.getConsultasByPaciente.bind(consultaController));
router.get('/:id', pacienteController.getPacienteById.bind(pacienteController));
router.post('/', pacienteController.createPaciente.bind(pacienteController));
router.put('/:id', pacienteController.updatePaciente.bind(pacienteController));
router.delete('/:id', pacienteController.deletePaciente.bind(pacienteController));
exports.default = router;
//# sourceMappingURL=pacientes.js.map