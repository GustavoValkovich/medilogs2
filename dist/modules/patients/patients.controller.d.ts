import { Request, Response } from 'express';
export declare class PatientsController {
    getAllPatients: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getPatientById: (req: Request, res: Response, next: import("express").NextFunction) => void;
    createPatient: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updatePatient: (req: Request, res: Response, next: import("express").NextFunction) => void;
    deletePatient: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getImportantPatients: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getPatientsByDoctor: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
export declare const patientValidationSchemas: {
    create: {
        nombre: {
            required: boolean;
            type: "string";
            minLength: number;
            maxLength: number;
        };
        documento: {
            required: boolean;
            type: "string";
            minLength: number;
            maxLength: number;
        };
        nacimiento: {
            required: boolean;
            type: "string";
            pattern: RegExp;
        };
        sexo: {
            required: boolean;
            type: "string";
            values: string[];
        };
        obra_social: {
            required: boolean;
            type: "string";
            maxLength: number;
        };
        mail: {
            required: boolean;
            type: "string";
            pattern: RegExp;
        };
        medico_id: {
            required: boolean;
            type: "number";
        };
        importante: {
            required: boolean;
            type: "string";
            maxLength: number;
        };
    };
    update: {
        nombre: {
            required: boolean;
            type: "string";
            minLength: number;
            maxLength: number;
        };
        documento: {
            required: boolean;
            type: "string";
            minLength: number;
            maxLength: number;
        };
        nacimiento: {
            required: boolean;
            type: "string";
            pattern: RegExp;
        };
        sexo: {
            required: boolean;
            type: "string";
            values: string[];
        };
        obra_social: {
            required: boolean;
            type: "string";
            maxLength: number;
        };
        mail: {
            required: boolean;
            type: "string";
            pattern: RegExp;
        };
        medico_id: {
            required: boolean;
            type: "number";
        };
        importante: {
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
        search: {
            required: boolean;
            type: "string";
            maxLength: number;
        };
    };
};
//# sourceMappingURL=patients.controller.d.ts.map