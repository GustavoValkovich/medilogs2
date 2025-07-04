export interface DatabaseConfig {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
    type: 'postgresql' | 'sqlite';
    maxConnections: number;
    connectionTimeout: number;
}
export interface ServerConfig {
    port: number;
    startPort: number;
    maxPortRetries: number;
    env: 'development' | 'production' | 'test';
    corsOrigins: string[];
}
export interface AppConfig {
    name: string;
    version: string;
    apiPrefix: string;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
    database: DatabaseConfig;
    server: ServerConfig;
}
export declare const config: AppConfig;
export declare const validateConfig: () => void;
export declare const isDevelopment: boolean;
export declare const isProduction: boolean;
export declare const isTest: boolean;
//# sourceMappingURL=config.d.ts.map