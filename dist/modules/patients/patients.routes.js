"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patientsRouter = void 0;
const express_1 = require("express");
const patients_controller_1 = require("./patients.controller");
const middleware_1 = require("../../shared/middleware");
const router = (0, express_1.Router)();
exports.patientsRouter = router;
const controller = new patients_controller_1.PatientsController();
router.use(middleware_1.sanitizeInput);
router.get('/', (0, middleware_1.validateQuery)(patients_controller_1.patientValidationSchemas.query), controller.getAllPatients);
router.post('/', (0, middleware_1.validateBody)(patients_controller_1.patientValidationSchemas.create), controller.createPatient);
router.get('/important', controller.getImportantPatients);
router.get('/:id', (0, middleware_1.validateParams)(middleware_1.commonSchemas.id), controller.getPatientById);
router.put('/:id', (0, middleware_1.validateParams)(middleware_1.commonSchemas.id), (0, middleware_1.validateBody)(patients_controller_1.patientValidationSchemas.update), controller.updatePatient);
router.delete('/:id', (0, middleware_1.validateParams)(middleware_1.commonSchemas.id), controller.deletePatient);
router.get('/by-doctor/:medicoId', (0, middleware_1.validateParams)({ medicoId: { required: true, type: 'string', pattern: /^\d+$/ } }), controller.getPatientsByDoctor);
//# sourceMappingURL=patients.routes.js.map