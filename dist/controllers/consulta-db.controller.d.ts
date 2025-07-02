import { Request, Response } from 'express';
export declare class ConsultaController {
    getAllConsultas(req: Request, res: Response): Promise<void>;
    getConsultaById(req: Request, res: Response): Promise<void>;
    createConsulta(req: Request, res: Response): Promise<void>;
    updateConsulta(req: Request, res: Response): Promise<void>;
    deleteConsulta(req: Request, res: Response): Promise<void>;
    getConsultasByPaciente(req: Request, res: Response): Promise<void>;
    getUltimasConsultas(req: Request, res: Response): Promise<void>;
    searchConsultas(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=consulta-db.controller.d.ts.map