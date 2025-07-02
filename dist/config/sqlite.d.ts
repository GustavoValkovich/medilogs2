import { Database } from 'sqlite';
export declare const initSQLiteDatabase: () => Promise<Database>;
export declare const getSQLiteDB: () => Database;
export declare const sqliteQuery: (sql: string, params?: any[]) => Promise<any>;
export declare const testSQLiteConnection: () => Promise<boolean>;
export declare const closeSQLiteDB: () => Promise<void>;
//# sourceMappingURL=sqlite.d.ts.map