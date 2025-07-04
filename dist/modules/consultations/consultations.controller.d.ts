import { Request, Response } from 'express';
export declare class ConsultationsController {
    getAllConsultations: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getConsultationById: (req: Request, res: Response, next: import("express").NextFunction) => void;
    createConsultation: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateConsultation: (req: Request, res: Response, next: import("express").NextFunction) => void;
    deleteConsultation: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getConsultationsByPatient: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getRecentConsultations: (req: Request, res: Response, next: import("express").NextFunction) => void;
    searchConsultations: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
export declare const consultationValidationSchemas: {
    create: {
        paciente_id: {
            required: boolean;
            type: "number";
        };
        fecha_historia: {
            required: boolean;
            type: "string";
            pattern: RegExp;
        };
        historia: {
            required: boolean;
            type: "string";
            minLength: number;
            maxLength: number;
        };
        imagen: {
            required: boolean;
            type: "string";
            maxLength: number;
        };
    };
    update: {
        paciente_id: {
            required: boolean;
            type: "number";
        };
        fecha_historia: {
            required: boolean;
            type: "string";
            pattern: RegExp;
        };
        historia: {
            required: boolean;
            type: "string";
            minLength: number;
            maxLength: number;
        };
        imagen: {
            required: boolean;
            type: "string";
            maxLength: number;
        };
    };
    query: {
        page: {
            required: boolean;
            type: "string";
            pattern: RegExp;
        };
        limit: {
            required: boolean;
            type: "string";
            pattern: RegExp;
        };
        pacienteId: {
            required: boolean;
            type: "string";
            pattern: RegExp;
        };
        search: {
            required: boolean;
            type: "string";
            maxLength: number;
        };
    };
};
//# sourceMappingURL=consultations.controller.d.ts.map