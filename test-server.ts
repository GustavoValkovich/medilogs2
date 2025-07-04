// Test simple para verificar que el servidor funciona
import { createApp } from './src/core/app';

console.log('🔍 Iniciando test del servidor...');

try {
  const app = createApp();
  const port = 3000;
  
  const server = app.listen(port, () => {
    console.log(`✅ Servidor de prueba ejecutándose en http://localhost:${port}`);
    console.log('🔍 Probando endpoints...');
    
    // Cerrar después de 5 segundos
    setTimeout(() => {
      console.log('🔚 Cerrando servidor de prueba');
      server.close();
    }, 5000);
  });
  
  server.on('error', (error: any) => {
    console.error('❌ Error del servidor:', error);
  });
  
} catch (error) {
  console.error('❌ Error al crear la app:', error);
}
