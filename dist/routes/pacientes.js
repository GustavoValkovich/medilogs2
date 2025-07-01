"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paciente_controller_1 = require("../controllers/paciente.controller");
const router = (0, express_1.Router)();
const pacienteController = new paciente_controller_1.PacienteController();
router.get('/', pacienteController.getAllPacientes.bind(pacienteController));
router.get('/:id', pacienteController.getPacienteById.bind(pacienteController));
router.post('/', pacienteController.createPaciente.bind(pacienteController));
router.put('/:id', pacienteController.updatePaciente.bind(pacienteController));
router.delete('/:id', pacienteController.deletePaciente.bind(pacienteController));
exports.default = router;
//# sourceMappingURL=pacientes.js.map