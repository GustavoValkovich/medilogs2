export interface Paciente {
    id: string;
    nombre: string;
    apellido: string;
    edad: number;
    fechaNacimiento: Date;
    telefono?: string;
    email?: string;
    direccion?: string;
    numeroDocumento: string;
    tipoDocumento: 'DNI' | 'PASSPORT' | 'CEDULA';
    genero: 'M' | 'F' | 'OTRO';
    grupoSanguineo?: string;
    alergias?: string[];
    medicamentosActuales?: string[];
    enfermedadesCronicas?: string[];
    contactoEmergencia?: ContactoEmergencia;
    fechaCreacion: Date;
    fechaActualizacion: Date;
}
export interface ContactoEmergencia {
    nombre: string;
    telefono: string;
    relacion: string;
}
export interface ConsultaMedica {
    id: string;
    pacienteId: string;
    fecha: Date;
    motivoConsulta: string;
    sintomasActuales: string;
    examenFisico?: string;
    diagnostico: string;
    tratamiento: string;
    medicamentosRecetados?: MedicamentoRecetado[];
    observaciones?: string;
    proximaCita?: Date;
    medicoId: string;
    estadoConsulta: 'PROGRAMADA' | 'EN_CURSO' | 'COMPLETADA' | 'CANCELADA';
    fechaCreacion: Date;
    fechaActualizacion: Date;
}
export interface MedicamentoRecetado {
    nombre: string;
    dosis: string;
    frecuencia: string;
    duracion: string;
    indicaciones?: string;
}
export interface Medico {
    id: string;
    nombre: string;
    apellido: string;
    especialidad: string;
    numeroLicencia: string;
    telefono: string;
    email: string;
    horarioAtencion?: HorarioAtencion[];
}
export interface HorarioAtencion {
    dia: 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES' | 'SABADO' | 'DOMINGO';
    horaInicio: string;
    horaFin: string;
}
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export interface CreatePacienteRequest {
    nombre: string;
    apellido: string;
    edad: number;
    fechaNacimiento: string;
    telefono?: string;
    email?: string;
    direccion?: string;
    numeroDocumento: string;
    tipoDocumento: 'DNI' | 'PASSPORT' | 'CEDULA';
    genero: 'M' | 'F' | 'OTRO';
    grupoSanguineo?: string;
    alergias?: string[];
    medicamentosActuales?: string[];
    enfermedadesCronicas?: string[];
    contactoEmergencia?: ContactoEmergencia;
}
export interface UpdatePacienteRequest extends Partial<CreatePacienteRequest> {
    id: string;
}
export interface CreateConsultaRequest {
    pacienteId: string;
    fecha: string;
    motivoConsulta: string;
    sintomasActuales: string;
    examenFisico?: string;
    diagnostico: string;
    tratamiento: string;
    medicamentosRecetados?: MedicamentoRecetado[];
    observaciones?: string;
    proximaCita?: string;
    medicoId: string;
    estadoConsulta?: 'PROGRAMADA' | 'EN_CURSO' | 'COMPLETADA' | 'CANCELADA';
}
export interface UpdateConsultaRequest extends Partial<CreateConsultaRequest> {
    id: string;
}
//# sourceMappingURL=medical.types.d.ts.map