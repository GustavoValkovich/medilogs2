export interface ServerInstance {
    port: number;
    close: () => Promise<void>;
}
export declare const isPortAvailable: (port: number) => Promise<boolean>;
export declare const findAvailablePort: (startPort?: number) => Promise<number>;
export declare const killProcessOnPort: (port: number) => Promise<boolean>;
export declare const startServer: (app: any) => Promise<ServerInstance>;
export declare const setupGracefulShutdown: (serverInstance: ServerInstance) => void;
//# sourceMappingURL=server.d.ts.map