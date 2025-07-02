import { Request, Response } from 'express';
export declare class MedicoController {
    private medicoRepository;
    constructor();
    getAllMedicos(req: Request, res: Response): Promise<void>;
    getMedicoById(req: Request, res: Response): Promise<void>;
    createMedico(req: Request, res: Response): Promise<void>;
    updateMedico(req: Request, res: Response): Promise<void>;
    deleteMedico(req: Request, res: Response): Promise<void>;
    login(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=medico-db.controller.d.ts.map