import { Request, Response } from 'express';
export declare class DoctorsController {
    getAllDoctors: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getDoctorById: (req: Request, res: Response, next: import("express").NextFunction) => void;
    createDoctor: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateDoctor: (req: Request, res: Response, next: import("express").NextFunction) => void;
    deleteDoctor: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
export declare const doctorValidationSchemas: {
    create: {
        nombre: {
            required: boolean;
            type: "string";
            minLength: number;
            maxLength: number;
        };
        apellido: {
            required: boolean;
            type: "string";
            minLength: number;
            maxLength: number;
        };
        especialidad: {
            required: boolean;
            type: "string";
            minLength: number;
            maxLength: number;
        };
        telefono: {
            required: boolean;
            type: "string";
            maxLength: number;
        };
        email: {
            required: boolean;
            type: "string";
            pattern: RegExp;
        };
        matricula: {
            required: boolean;
            type: "string";
            minLength: number;
            maxLength: number;
        };
        password: {
            required: boolean;
            type: "string";
            minLength: number;
        };
    };
    update: {
        nombre: {
            required: boolean;
            type: "string";
            minLength: number;
            maxLength: number;
        };
        apellido: {
            required: boolean;
            type: "string";
            minLength: number;
            maxLength: number;
        };
        especialidad: {
            required: boolean;
            type: "string";
            minLength: number;
            maxLength: number;
        };
        telefono: {
            required: boolean;
            type: "string";
            maxLength: number;
        };
        email: {
            required: boolean;
            type: "string";
            pattern: RegExp;
        };
        matricula: {
            required: boolean;
            type: "string";
            minLength: number;
            maxLength: number;
        };
        password: {
            required: boolean;
            type: "string";
            minLength: number;
        };
    };
};
//# sourceMappingURL=doctors.controller.d.ts.map