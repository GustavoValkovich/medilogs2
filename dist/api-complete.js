"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const types_1 = require("./types");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
let pacientes = [];
let consultas = [];
let nextPacienteId = 1;
let nextConsultaId = 1;
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'medilogs2-api'
    });
});
app.get('/api', (req, res) => {
    res.json({
        message: 'MediLogs2 API - Sistema de Gestión Médica',
        version: '1.0.0',
        totalPacientes: pacientes.length,
        totalConsultas: consultas.length,
        endpoints: {
            pacientes: '/api/pacientes',
            consultas: '/api/consultas'
        }
    });
});
app.get('/api/pacientes', (req, res) => {
    const response = {
        success: true,
        data: pacientes.filter(p => p.activo)
    };
    res.json(response);
});
app.get('/api/pacientes/:id', (req, res) => {
    const paciente = pacientes.find(p => p.id === req.params.id && p.activo);
    if (!paciente) {
        const response = {
            success: false,
            error: 'Paciente no encontrado'
        };
        res.status(404).json(response);
        return;
    }
    const response = {
        success: true,
        data: paciente
    };
    res.json(response);
});
app.post('/api/pacientes', (req, res) => {
    const data = req.body;
    if (!data.nombre || !data.apellido || !data.numeroDocumento) {
        const response = {
            success: false,
            error: 'Nombre, apellido y número de documento son requeridos'
        };
        res.status(400).json(response);
        return;
    }
    const existente = pacientes.find(p => p.numeroDocumento === data.numeroDocumento && p.activo);
    if (existente) {
        const response = {
            success: false,
            error: 'Ya existe un paciente con ese número de documento'
        };
        res.status(409).json(response);
        return;
    }
    const nuevoPaciente = {
        id: nextPacienteId.toString(),
        ...data,
        fechaNacimiento: new Date(data.fechaNacimiento),
        fechaRegistro: new Date(),
        activo: true
    };
    pacientes.push(nuevoPaciente);
    nextPacienteId++;
    const response = {
        success: true,
        data: nuevoPaciente,
        message: 'Paciente creado exitosamente'
    };
    res.status(201).json(response);
});
app.put('/api/pacientes/:id', (req, res) => {
    const index = pacientes.findIndex(p => p.id === req.params.id && p.activo);
    if (index === -1) {
        const response = {
            success: false,
            error: 'Paciente no encontrado'
        };
        res.status(404).json(response);
        return;
    }
    pacientes[index] = { ...pacientes[index], ...req.body };
    const response = {
        success: true,
        data: pacientes[index],
        message: 'Paciente actualizado exitosamente'
    };
    res.json(response);
});
app.delete('/api/pacientes/:id', (req, res) => {
    const index = pacientes.findIndex(p => p.id === req.params.id && p.activo);
    if (index === -1) {
        const response = {
            success: false,
            error: 'Paciente no encontrado'
        };
        res.status(404).json(response);
        return;
    }
    pacientes[index].activo = false;
    const response = {
        success: true,
        message: 'Paciente eliminado exitosamente'
    };
    res.json(response);
});
app.get('/api/consultas', (req, res) => {
    const response = {
        success: true,
        data: consultas.sort((a, b) => b.fecha.getTime() - a.fecha.getTime())
    };
    res.json(response);
});
app.get('/api/consultas/:id', (req, res) => {
    const consulta = consultas.find(c => c.id === req.params.id);
    if (!consulta) {
        const response = {
            success: false,
            error: 'Consulta no encontrada'
        };
        res.status(404).json(response);
        return;
    }
    const response = {
        success: true,
        data: consulta
    };
    res.json(response);
});
app.get('/api/pacientes/:pacienteId/consultas', (req, res) => {
    const consultasPaciente = consultas.filter(c => c.pacienteId === req.params.pacienteId);
    const response = {
        success: true,
        data: consultasPaciente.sort((a, b) => b.fecha.getTime() - a.fecha.getTime())
    };
    res.json(response);
});
app.post('/api/consultas', (req, res) => {
    const data = req.body;
    if (!data.pacienteId || !data.fecha || !data.motivo || !data.medico) {
        const response = {
            success: false,
            error: 'PacienteId, fecha, motivo y médico son requeridos'
        };
        res.status(400).json(response);
        return;
    }
    const pacienteExiste = pacientes.find(p => p.id === data.pacienteId && p.activo);
    if (!pacienteExiste) {
        const response = {
            success: false,
            error: 'El paciente especificado no existe'
        };
        res.status(400).json(response);
        return;
    }
    const nuevaConsulta = {
        id: nextConsultaId.toString(),
        ...data,
        fecha: new Date(data.fecha),
        sintomas: data.sintomas || [],
        signosVitales: data.signosVitales || {},
        estado: types_1.EstadoConsulta.PROGRAMADA
    };
    consultas.push(nuevaConsulta);
    nextConsultaId++;
    const response = {
        success: true,
        data: nuevaConsulta,
        message: 'Consulta creada exitosamente'
    };
    res.status(201).json(response);
});
app.put('/api/consultas/:id', (req, res) => {
    const index = consultas.findIndex(c => c.id === req.params.id);
    if (index === -1) {
        const response = {
            success: false,
            error: 'Consulta no encontrada'
        };
        res.status(404).json(response);
        return;
    }
    const updateData = { ...req.body };
    if (updateData.proximaCita) {
        updateData.proximaCita = new Date(updateData.proximaCita);
    }
    consultas[index] = { ...consultas[index], ...updateData };
    const response = {
        success: true,
        data: consultas[index],
        message: 'Consulta actualizada exitosamente'
    };
    res.json(response);
});
app.patch('/api/consultas/:id/estado', (req, res) => {
    const index = consultas.findIndex(c => c.id === req.params.id);
    const { estado } = req.body;
    if (index === -1) {
        const response = {
            success: false,
            error: 'Consulta no encontrada'
        };
        res.status(404).json(response);
        return;
    }
    if (!Object.values(types_1.EstadoConsulta).includes(estado)) {
        const response = {
            success: false,
            error: 'Estado inválido. Valores permitidos: ' + Object.values(types_1.EstadoConsulta).join(', ')
        };
        res.status(400).json(response);
        return;
    }
    consultas[index].estado = estado;
    const response = {
        success: true,
        data: consultas[index],
        message: `Estado cambiado a ${estado}`
    };
    res.json(response);
});
app.delete('/api/consultas/:id', (req, res) => {
    const index = consultas.findIndex(c => c.id === req.params.id);
    if (index === -1) {
        const response = {
            success: false,
            error: 'Consulta no encontrada'
        };
        res.status(404).json(response);
        return;
    }
    consultas.splice(index, 1);
    const response = {
        success: true,
        message: 'Consulta eliminada exitosamente'
    };
    res.json(response);
});
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint no encontrado'
    });
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`\n🚀 MediLogs2 API corriendo en puerto ${PORT}`);
    console.log(`📋 Health: http://localhost:${PORT}/health`);
    console.log(`🏥 API Info: http://localhost:${PORT}/api`);
    console.log(`\n📖 ENDPOINTS PARA POSTMAN:`);
    console.log(`👥 PACIENTES:`);
    console.log(`   GET    http://localhost:${PORT}/api/pacientes`);
    console.log(`   POST   http://localhost:${PORT}/api/pacientes`);
    console.log(`   GET    http://localhost:${PORT}/api/pacientes/:id`);
    console.log(`   PUT    http://localhost:${PORT}/api/pacientes/:id`);
    console.log(`   DELETE http://localhost:${PORT}/api/pacientes/:id`);
    console.log(`\n📅 CONSULTAS:`);
    console.log(`   GET    http://localhost:${PORT}/api/consultas`);
    console.log(`   POST   http://localhost:${PORT}/api/consultas`);
    console.log(`   GET    http://localhost:${PORT}/api/consultas/:id`);
    console.log(`   GET    http://localhost:${PORT}/api/pacientes/:pacienteId/consultas`);
    console.log(`   PUT    http://localhost:${PORT}/api/consultas/:id`);
    console.log(`   PATCH  http://localhost:${PORT}/api/consultas/:id/estado`);
    console.log(`   DELETE http://localhost:${PORT}/api/consultas/:id\n`);
});
exports.default = app;
//# sourceMappingURL=api-complete.js.map