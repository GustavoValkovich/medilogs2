"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./config/database");
async function main() {
    console.log('🔗 Probando conexión a PostgreSQL...');
    const isConnected = await (0, database_1.testConnection)();
    if (isConnected) {
        console.log('✅ ¡Conexión exitosa! La base de datos está lista.');
    }
    else {
        console.log('❌ No se pudo conectar a la base de datos.');
        process.exit(1);
    }
    process.exit(0);
}
main().catch(console.error);
//# sourceMappingURL=test-db.js.map