"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const middleware_1 = require("../../shared/middleware");
const router = (0, express_1.Router)();
exports.authRouter = router;
const controller = new auth_controller_1.AuthController();
router.use(middleware_1.sanitizeInput);
router.post('/login', (0, middleware_1.validateBody)(auth_controller_1.authValidationSchemas.login), controller.login);
router.post('/logout', controller.logout);
router.get('/me', controller.getCurrentUser);
//# sourceMappingURL=auth.routes.js.map