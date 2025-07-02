export interface PacienteDB {
    id: number;
    medico_id?: number;
    nombre?: string;
    documento?: string;
    nacimiento?: Date;
    importante?: string;
    sexo?: string;
    obra_social?: string;
    mail?: string;
}
export interface ConsultaDB {
    id: number;
    paciente_id?: number;
    fecha_historia?: Date;
    historia?: string;
    imagen?: string;
}
export interface MedicoDB {
    id: number;
    nombre: string;
    email: string;
    password: string;
}
export interface CreatePacienteRequest {
    nombre: string;
    documento: string;
    nacimiento: string;
    sexo?: 'M' | 'F' | 'O';
    obra_social?: string;
    mail?: string;
    medico_id?: number;
    importante?: string;
}
export interface UpdatePacienteRequest {
    nombre?: string;
    documento?: string;
    nacimiento?: string;
    sexo?: 'M' | 'F' | 'O';
    obra_social?: string;
    mail?: string;
    medico_id?: number;
    importante?: string;
}
export interface CreateConsultaRequest {
    paciente_id: number;
    fecha_historia: string;
    historia: string;
    imagen?: string;
}
export interface UpdateConsultaRequest {
    paciente_id?: number;
    fecha_historia?: string;
    historia?: string;
    imagen?: string;
}
export interface CreateMedicoRequest {
    nombre: string;
    email: string;
    password: string;
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
export interface PacienteCompleto extends PacienteDB {
    medico_nombre?: string;
    total_consultas?: number;
}
export interface ConsultaCompleta extends ConsultaDB {
    paciente_nombre?: string;
    paciente_documento?: string;
}
//# sourceMappingURL=database.d.ts.map