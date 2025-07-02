import { Request, Response } from 'express';
export declare class PacienteController {
    getAllPacientes(req: Request, res: Response): Promise<void>;
    getPacienteById(req: Request, res: Response): Promise<void>;
    createPaciente(req: Request, res: Response): Promise<void>;
    updatePaciente(req: Request, res: Response): Promise<void>;
    deletePaciente(req: Request, res: Response): Promise<void>;
    getPacientesImportantes(req: Request, res: Response): Promise<void>;
    getPacientesByMedico(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=paciente-db.controller.d.ts.map