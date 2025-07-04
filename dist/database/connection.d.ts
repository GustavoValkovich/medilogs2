export interface QueryResult {
    rows: any[];
    rowCount: number;
}
export interface DatabaseConnection {
    query: (text: string, params?: any[]) => Promise<QueryResult>;
    testConnection: () => Promise<boolean>;
    close: () => Promise<void>;
    type: 'postgresql' | 'sqlite';
}
export declare const createDatabaseConnection: () => Promise<DatabaseConnection>;
export declare const getDatabase: () => Promise<DatabaseConnection>;
export declare const closeDatabase: () => Promise<void>;
export declare const query: (text: string, params?: any[]) => Promise<QueryResult>;
export declare const testConnection: () => Promise<boolean>;
//# sourceMappingURL=connection.d.ts.map