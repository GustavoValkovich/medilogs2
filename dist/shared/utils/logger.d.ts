export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export interface LogMessage {
    level: LogLevel;
    message: string;
    timestamp: string;
    data?: any;
}
declare class Logger {
    private logLevel;
    constructor(level?: LogLevel);
    private shouldLog;
    private formatMessage;
    private getEmoji;
    private log;
    debug(message: string, data?: any): void;
    info(message: string, data?: any): void;
    warn(message: string, data?: any): void;
    error(message: string, data?: any): void;
    performance(operation: string, duration: number, data?: any): void;
    query(sql: string, duration: number, rowCount?: number): void;
    request(method: string, path: string, statusCode: number, duration: number): void;
}
export declare const logger: Logger;
export declare const createModuleLogger: (moduleName: string) => {
    debug: (message: string, data?: any) => void;
    info: (message: string, data?: any) => void;
    warn: (message: string, data?: any) => void;
    error: (message: string, data?: any) => void;
};
export {};
//# sourceMappingURL=logger.d.ts.map