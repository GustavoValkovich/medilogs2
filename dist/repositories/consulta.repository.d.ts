import { ConsultaMedica, CreateConsultaRequest, UpdateConsultaRequest, EstadoConsulta } from '../types';
export declare class ConsultaRepository {
    findAll(): Promise<ConsultaMedica[]>;
    findById(id: string): Promise<ConsultaMedica | null>;
    findByPacienteId(pacienteId: string): Promise<ConsultaMedica[]>;
    findByEstado(estado: EstadoConsulta): Promise<ConsultaMedica[]>;
    findByDateRange(fechaInicio: Date, fechaFin: Date): Promise<ConsultaMedica[]>;
    findByMedico(medico: string): Promise<ConsultaMedica[]>;
    create(consultaData: CreateConsultaRequest): Promise<ConsultaMedica>;
    update(id: string, updateData: UpdateConsultaRequest): Promise<ConsultaMedica | null>;
    delete(id: string): Promise<boolean>;
    updateEstado(id: string, estado: EstadoConsulta): Promise<ConsultaMedica | null>;
    getEstadisticas(): Promise<any>;
    private mapRowToConsulta;
    private mapFieldToDb;
}
//# sourceMappingURL=consulta.repository.d.ts.map