"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./config/database");
async function checkDatabase() {
    console.log('📋 Verificando estructura de la base de datos...\n');
    try {
        const tablesResult = await (0, database_1.query)(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `);
        console.log('📊 Tablas existentes:');
        if (tablesResult.rows.length === 0) {
            console.log('   No hay tablas creadas aún.');
        }
        else {
            tablesResult.rows.forEach(row => {
                console.log(`   - ${row.tablename}`);
            });
        }
        console.log('\n🔍 Verificando estructura específica...');
        const checkPacientes = await (0, database_1.query)(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'pacientes'
      );
    `);
        const checkConsultas = await (0, database_1.query)(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'consultas'
      );
    `);
        console.log(`📋 Tabla 'pacientes': ${checkPacientes.rows[0].exists ? '✅ Existe' : '❌ No existe'}`);
        console.log(`📋 Tabla 'consultas': ${checkConsultas.rows[0].exists ? '✅ Existe' : '❌ No existe'}`);
        if (checkPacientes.rows[0].exists) {
            console.log('\n📊 Estructura de tabla "pacientes":');
            const pacientesStructure = await (0, database_1.query)(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = 'pacientes'
        ORDER BY ordinal_position;
      `);
            pacientesStructure.rows.forEach(col => {
                console.log(`   - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : ''}`);
            });
        }
        if (checkConsultas.rows[0].exists) {
            console.log('\n📊 Estructura de tabla "consultas":');
            const consultasStructure = await (0, database_1.query)(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = 'consultas'
        ORDER BY ordinal_position;
      `);
            consultasStructure.rows.forEach(col => {
                console.log(`   - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : ''}`);
            });
        }
    }
    catch (error) {
        console.error('❌ Error verificando la base de datos:', error);
    }
    process.exit(0);
}
checkDatabase().catch(console.error);
//# sourceMappingURL=check-db.js.map