import { testConnection } from './config/database';

// Script para probar la conexión a la base de datos
async function main() {
  console.log('🔗 Probando conexión a PostgreSQL...');
  
  const isConnected = await testConnection();
  
  if (isConnected) {
    console.log('✅ ¡Conexión exitosa! La base de datos está lista.');
  } else {
    console.log('❌ No se pudo conectar a la base de datos.');
    process.exit(1);
  }
  
  process.exit(0);
}

main().catch(console.error);
