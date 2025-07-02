// Interfaces adaptadas a la estructura de base de datos existente

// Tabla: paciente
export interface PacienteDB {
  id: number;
  medico_id?: number;
  nombre?: string;
  documento?: string;
  nacimiento?: Date;
  importante?: boolean;
  sexo?: string;
  obra_social?: string;
  mail?: string;
}

// Tabla: consulta
export interface ConsultaDB {
  id: number;
  paciente_id?: number;
  fecha_historia?: Date;
  historia?: string;
  imagen?: string;
}

// Tabla: medico
export interface MedicoDB {
  id: number;
  nombre: string;
  email: string;
  password: string;
}

// Interfaces para requests de API (más completas)
export interface CreatePacienteRequest {
  nombre: string;
  documento: string;
  nacimiento: string; // Se convierte a Date
  sexo?: 'M' | 'F' | 'O';
  obra_social?: string;
  mail?: string;
  medico_id?: number;
  importante?: boolean;
}

export interface UpdatePacienteRequest {
  nombre?: string;
  documento?: string;
  nacimiento?: string;
  sexo?: 'M' | 'F' | 'O';
  obra_social?: string;
  mail?: string;
  medico_id?: number;
  importante?: boolean;
}

export interface CreateConsultaRequest {
  paciente_id: number;
  fecha_historia: string; // Se convierte a Date
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

// Respuestas de API estandarizadas
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

// Tipos extendidos para respuestas (combinan datos de múltiples tablas)
export interface PacienteCompleto extends PacienteDB {
  medico_nombre?: string;
  total_consultas?: number;
}

export interface ConsultaCompleta extends ConsultaDB {
  paciente_nombre?: string;
  paciente_documento?: string;
}
