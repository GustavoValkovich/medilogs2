import { PacienteDB, PacienteCompleto, CreatePacienteRequest, UpdatePacienteRequest } from '../types/database';
export declare class PacienteRepository {
    findAll(page?: number, limit?: number, search?: string): Promise<{
        pacientes: PacienteCompleto[];
        total: number;
    }>;
    findById(id: number): Promise<PacienteCompleto | null>;
    findByDocumento(documento: string): Promise<PacienteDB | null>;
    create(pacienteData: CreatePacienteRequest): Promise<PacienteDB>;
    update(id: number, updateData: UpdatePacienteRequest): Promise<PacienteDB | null>;
    delete(id: number): Promise<boolean>;
    getPacientesByMedico(medicoId: number): Promise<PacienteDB[]>;
    getPacientesImportantes(): Promise<PacienteDB[]>;
}
//# sourceMappingURL=paciente-db.repository.d.ts.map