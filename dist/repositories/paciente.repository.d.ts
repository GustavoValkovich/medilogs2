import { Paciente, CreatePacienteRequest } from '../types';
export declare class PacienteRepository {
    findAll(): Promise<Paciente[]>;
    findById(id: string): Promise<Paciente | null>;
    findByDocumento(numeroDocumento: string): Promise<Paciente | null>;
    create(pacienteData: CreatePacienteRequest): Promise<Paciente>;
    update(id: string, updateData: Partial<Paciente>): Promise<Paciente | null>;
    delete(id: string): Promise<boolean>;
    search(searchTerm: string, limit?: number, offset?: number): Promise<Paciente[]>;
    private mapRowToPaciente;
    private mapFieldToDb;
}
//# sourceMappingURL=paciente.repository.d.ts.map