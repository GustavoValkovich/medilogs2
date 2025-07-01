"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstadoConsulta = exports.GrupoSanguineo = exports.Sexo = exports.TipoDocumento = void 0;
var TipoDocumento;
(function (TipoDocumento) {
    TipoDocumento["DNI"] = "DNI";
    TipoDocumento["PASAPORTE"] = "PASAPORTE";
    TipoDocumento["CEDULA"] = "CEDULA";
    TipoDocumento["OTRO"] = "OTRO";
})(TipoDocumento || (exports.TipoDocumento = TipoDocumento = {}));
var Sexo;
(function (Sexo) {
    Sexo["MASCULINO"] = "MASCULINO";
    Sexo["FEMENINO"] = "FEMENINO";
    Sexo["OTRO"] = "OTRO";
})(Sexo || (exports.Sexo = Sexo = {}));
var GrupoSanguineo;
(function (GrupoSanguineo) {
    GrupoSanguineo["A_POSITIVO"] = "A+";
    GrupoSanguineo["A_NEGATIVO"] = "A-";
    GrupoSanguineo["B_POSITIVO"] = "B+";
    GrupoSanguineo["B_NEGATIVO"] = "B-";
    GrupoSanguineo["AB_POSITIVO"] = "AB+";
    GrupoSanguineo["AB_NEGATIVO"] = "AB-";
    GrupoSanguineo["O_POSITIVO"] = "O+";
    GrupoSanguineo["O_NEGATIVO"] = "O-";
})(GrupoSanguineo || (exports.GrupoSanguineo = GrupoSanguineo = {}));
var EstadoConsulta;
(function (EstadoConsulta) {
    EstadoConsulta["PROGRAMADA"] = "PROGRAMADA";
    EstadoConsulta["EN_CURSO"] = "EN_CURSO";
    EstadoConsulta["COMPLETADA"] = "COMPLETADA";
    EstadoConsulta["CANCELADA"] = "CANCELADA";
    EstadoConsulta["NO_ASISTIO"] = "NO_ASISTIO";
})(EstadoConsulta || (exports.EstadoConsulta = EstadoConsulta = {}));
//# sourceMappingURL=index.js.map