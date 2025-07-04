import { Request, Response } from 'express';
export declare class AuthController {
    login: (req: Request, res: Response, next: import("express").NextFunction) => void;
    logout: (req: Request, res: Response, next: import("express").NextFunction) => void;
    private verifyPassword;
    getCurrentUser: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
export declare const authValidationSchemas: {
    login: {
        email: {
            required: boolean;
            type: "string";
            pattern: RegExp;
        };
        password: {
            required: boolean;
            type: "string";
            minLength: number;
        };
    };
};
//# sourceMappingURL=auth.controller.d.ts.map