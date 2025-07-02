"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./config/database");
async function checkExistingTables() {
    console.log('📋 Verificando estructura de las tablas existentes...\n');
    try {
        console.log('📊 Estructura de tabla "paciente":');
        const pacienteStructure = await (0, database_1.query)(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'paciente'
      ORDER BY ordinal_position;
    `);
        pacienteStructure.rows.forEach(col => {
            console.log(`   - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULLABLE'}`);
        });
        console.log('\n📊 Estructura de tabla "consulta":');
        const consultaStructure = await (0, database_1.query)(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'consulta'
      ORDER BY ordinal_position;
    `);
        consultaStructure.rows.forEach(col => {
            console.log(`   - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULLABLE'}`);
        });
        console.log('\n📊 Estructura de tabla "medico":');
        const medicoStructure = await (0, database_1.query)(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'medico'
      ORDER BY ordinal_position;
    `);
        medicoStructure.rows.forEach(col => {
            console.log(`   - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULLABLE'}`);
        });
        console.log('\n📊 Conteo de registros:');
        const pacienteCount = await (0, database_1.query)('SELECT COUNT(*) FROM paciente');
        const consultaCount = await (0, database_1.query)('SELECT COUNT(*) FROM consulta');
        const medicoCount = await (0, database_1.query)('SELECT COUNT(*) FROM medico');
        console.log(`   - Pacientes: ${pacienteCount.rows[0].count}`);
        console.log(`   - Consultas: ${consultaCount.rows[0].count}`);
        console.log(`   - Médicos: ${medicoCount.rows[0].count}`);
    }
    catch (error) {
        console.error('❌ Error verificando las tablas:', error);
    }
    process.exit(0);
}
checkExistingTables().catch(console.error);
//# sourceMappingURL=check-existing-tables.js.map