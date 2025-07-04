"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorsRouter = void 0;
const express_1 = require("express");
const doctors_controller_1 = require("./doctors.controller");
const middleware_1 = require("../../shared/middleware");
const router = (0, express_1.Router)();
exports.doctorsRouter = router;
const controller = new doctors_controller_1.DoctorsController();
router.use(middleware_1.sanitizeInput);
router.get('/', controller.getAllDoctors);
router.post('/', (0, middleware_1.validateBody)(doctors_controller_1.doctorValidationSchemas.create), controller.createDoctor);
router.get('/:id', (0, middleware_1.validateParams)(middleware_1.commonSchemas.id), controller.getDoctorById);
router.put('/:id', (0, middleware_1.validateParams)(middleware_1.commonSchemas.id), (0, middleware_1.validateBody)(doctors_controller_1.doctorValidationSchemas.update), controller.updateDoctor);
router.delete('/:id', (0, middleware_1.validateParams)(middleware_1.commonSchemas.id), controller.deleteDoctor);
//# sourceMappingURL=doctors.routes.js.map