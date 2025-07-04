import { Request, Response, NextFunction } from 'express';
export interface ValidationSchema {
    [key: string]: {
        required?: boolean;
        type?: 'string' | 'number' | 'boolean' | 'object' | 'array';
        minLength?: number;
        maxLength?: number;
        pattern?: RegExp;
        values?: any[];
    };
}
export declare const validateBody: (schema: ValidationSchema) => (req: Request, res: Response, next: NextFunction) => void;
export declare const validateQuery: (schema: ValidationSchema) => (req: Request, res: Response, next: NextFunction) => void;
export declare const validateParams: (schema: ValidationSchema) => (req: Request, res: Response, next: NextFunction) => void;
export declare const commonSchemas: {
    id: {
        id: {
            required: boolean;
            type: "string";
            pattern: RegExp;
        };
    };
    pagination: {
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
    };
    email: {
        email: {
            required: boolean;
            type: "string";
            pattern: RegExp;
        };
    };
};
export declare const sanitizeInput: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=validation.d.ts.map