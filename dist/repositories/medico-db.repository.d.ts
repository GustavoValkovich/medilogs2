import { MedicoDB, CreateMedicoRequest } from '../types/database';
export declare class MedicoRepository {
    findAll(): Promise<MedicoDB[]>;
    findById(id: number): Promise<MedicoDB | null>;
    findByEmail(email: string): Promise<MedicoDB | null>;
    create(medicoData: CreateMedicoRequest): Promise<MedicoDB>;
    update(id: number, updateData: Partial<CreateMedicoRequest>): Promise<MedicoDB | null>;
    delete(id: number): Promise<boolean>;
    validatePassword(email: string, password: string): Promise<MedicoDB | null>;
}
//# sourceMappingURL=medico-db.repository.d.ts.map