"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = exports.consultationsRouter = exports.doctorsRouter = exports.patientsRouter = void 0;
__exportStar(require("./patients"), exports);
__exportStar(require("./doctors"), exports);
__exportStar(require("./consultations"), exports);
__exportStar(require("./auth"), exports);
var patients_1 = require("./patients");
Object.defineProperty(exports, "patientsRouter", { enumerable: true, get: function () { return patients_1.patientsRouter; } });
var doctors_1 = require("./doctors");
Object.defineProperty(exports, "doctorsRouter", { enumerable: true, get: function () { return doctors_1.doctorsRouter; } });
var consultations_1 = require("./consultations");
Object.defineProperty(exports, "consultationsRouter", { enumerable: true, get: function () { return consultations_1.consultationsRouter; } });
var auth_1 = require("./auth");
Object.defineProperty(exports, "authRouter", { enumerable: true, get: function () { return auth_1.authRouter; } });
//# sourceMappingURL=index.js.map