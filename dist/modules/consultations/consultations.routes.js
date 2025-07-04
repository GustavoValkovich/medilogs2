"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consultationsRouter = void 0;
const express_1 = require("express");
const consultations_controller_1 = require("./consultations.controller");
const middleware_1 = require("../../shared/middleware");
const router = (0, express_1.Router)();
exports.consultationsRouter = router;
const controller = new consultations_controller_1.ConsultationsController();
router.use(middleware_1.sanitizeInput);
router.get('/', (0, middleware_1.validateQuery)(consultations_controller_1.consultationValidationSchemas.query), controller.getAllConsultations);
router.post('/', (0, middleware_1.validateBody)(consultations_controller_1.consultationValidationSchemas.create), controller.createConsultation);
router.get('/recent', controller.getRecentConsultations);
router.get('/search', (0, middleware_1.validateQuery)({ search: { required: true, type: 'string', minLength: 1, maxLength: 100 } }), controller.searchConsultations);
router.get('/:id', (0, middleware_1.validateParams)(middleware_1.commonSchemas.id), controller.getConsultationById);
router.put('/:id', (0, middleware_1.validateParams)(middleware_1.commonSchemas.id), (0, middleware_1.validateBody)(consultations_controller_1.consultationValidationSchemas.update), controller.updateConsultation);
router.delete('/:id', (0, middleware_1.validateParams)(middleware_1.commonSchemas.id), controller.deleteConsultation);
router.get('/by-patient/:pacienteId', (0, middleware_1.validateParams)({ pacienteId: { required: true, type: 'string', pattern: /^\d+$/ } }), controller.getConsultationsByPatient);
//# sourceMappingURL=consultations.routes.js.map