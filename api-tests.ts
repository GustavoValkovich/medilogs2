// Script de pruebas de API
import { createApp } from './src/core/app';

console.log('🚀 INICIANDO PRUEBAS DE API MEDILOGS2 OPTIMIZADA');
console.log('================================================');

const app = createApp();
const port = 3000;

const server = app.listen(port, async () => {
  console.log(`✅ Servidor ejecutándose en http://localhost:${port}`);
  console.log('');
  
  // Importar bibliotecas para hacer requests
  const fetch = require('node-fetch');
  
  try {
    console.log('📊 PRUEBA 1: Health Check');
    console.log('------------------------');
    const healthResponse = await fetch(`http://localhost:${port}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Status:', healthResponse.status);
    console.log('📋 Response:', JSON.stringify(healthData, null, 2));
    console.log('');
    
    console.log('📊 PRUEBA 2: API Info');
    console.log('--------------------');
    const apiResponse = await fetch(`http://localhost:${port}/api`);
    const apiData = await apiResponse.json();
    console.log('✅ Status:', apiResponse.status);
    console.log('📋 Response:', JSON.stringify(apiData, null, 2));
    console.log('');
    
    console.log('📊 PRUEBA 3: GET Pacientes (nuevo endpoint)');
    console.log('-------------------------------------------');
    const patientsResponse = await fetch(`http://localhost:${port}/api/patients`);
    const patientsData = await patientsResponse.json();
    console.log('✅ Status:', patientsResponse.status);
    console.log('📋 Response:', JSON.stringify(patientsData, null, 2));
    console.log('');
    
    console.log('📊 PRUEBA 4: GET Médicos (nuevo endpoint)');
    console.log('-----------------------------------------');
    const doctorsResponse = await fetch(`http://localhost:${port}/api/doctors`);
    const doctorsData = await doctorsResponse.json();
    console.log('✅ Status:', doctorsResponse.status);
    console.log('📋 Response:', JSON.stringify(doctorsData, null, 2));
    console.log('');
    
    console.log('📊 PRUEBA 5: POST - Crear Paciente');
    console.log('----------------------------------');
    const newPatient = {
      nombre: 'Juan Test',
      apellido: 'Optimizado',
      fecha_nacimiento: '1990-01-01',
      telefono: '123456789',
      email: 'juan.test@medilogs.com',
      direccion: 'Calle Test 123'
    };
    
    const createPatientResponse = await fetch(`http://localhost:${port}/api/patients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPatient)
    });
    
    const createPatientData = await createPatientResponse.json();
    console.log('✅ Status:', createPatientResponse.status);
    console.log('📋 Response:', JSON.stringify(createPatientData, null, 2));
    console.log('');
    
    console.log('🎉 TODAS LAS PRUEBAS COMPLETADAS');
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
  } finally {
    console.log('🔚 Cerrando servidor...');
    server.close();
  }
});

server.on('error', (error: any) => {
  console.error('❌ Error del servidor:', error);
});
