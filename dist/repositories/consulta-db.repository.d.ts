import { ConsultaDB, ConsultaCompleta, CreateConsultaRequest, UpdateConsultaRequest } from '../types/database';
export declare class ConsultaRepository {
    findAll(page?: number, limit?: number, pacienteId?: number): Promise<{
        consultas: ConsultaCompleta[];
        total: number;
    }>;
    findById(id: number): Promise<ConsultaCompleta | null>;
    findByPacienteId(pacienteId: number): Promise<ConsultaDB[]>;
    create(consultaData: CreateConsultaRequest): Promise<ConsultaDB>;
    update(id: number, updateData: UpdateConsultaRequest): Promise<ConsultaDB | null>;
    delete(id: number): Promise<boolean>;
    getConsultasByDateRange(fechaInicio: Date, fechaFin: Date): Promise<ConsultaDB[]>;
    getUltimasConsultas(limit?: number): Promise<ConsultaCompleta[]>;
    searchConsultas(searchTerm: string): Promise<ConsultaCompleta[]>;
}
//# sourceMappingURL=consulta-db.repository.d.ts.map