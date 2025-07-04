// Pruebas adicionales de POST con datos correctos
import { createApp } from './src/core/app';

console.log('🚀 PRUEBAS ADICIONALES DE POST CON DATOS CORRECTOS');
console.log('==================================================');

const app = createApp();
const port = 3001;

const server = app.listen(port, async () => {
  console.log(`✅ Servidor ejecutándose en http://localhost:${port}`);
  
  const fetch = require('node-fetch');
  
  try {
    console.log('📊 PRUEBA: POST - Crear Paciente (datos corregidos)');
    console.log('--------------------------------------------------');
    
    const newPatient = {
      nombre: 'María Test',
      documento: '99988877T',
      nacimiento: '1995-06-15', // Formato correcto de fecha
      sexo: 'F',
      obra_social: 'OSDE',
      mail: 'maria.test@medilogs.com',
      importante: 'Paciente de prueba creado por API optimizada'
    };
    
    const createResponse = await fetch(`http://localhost:${port}/api/patients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPatient)
    });
    
    const createData = await createResponse.json();
    console.log('✅ Status:', createResponse.status);
    console.log('📋 Response:', JSON.stringify(createData, null, 2));
    console.log('');
    
    if (createResponse.status === 201) {
      const patientId = createData.data.id;
      console.log('📊 PRUEBA: GET - Obtener paciente recién creado');
      console.log('----------------------------------------------');
      
      const getResponse = await fetch(`http://localhost:${port}/api/patients/${patientId}`);
      const getData = await getResponse.json();
      console.log('✅ Status:', getResponse.status);
      console.log('📋 Response:', JSON.stringify(getData, null, 2));
      console.log('');
      
      console.log('📊 PRUEBA: POST - Crear consulta para el paciente');
      console.log('-----------------------------------------------');
      
      const newConsultation = {
        paciente_id: patientId,
        fecha: '2025-07-04',
        motivo: 'Consulta de prueba para paciente creado por API optimizada',
        diagnostico: 'Prueba de API exitosa',
        tratamiento: 'Continuar con las pruebas',
        observaciones: 'Paciente creado automáticamente durante las pruebas'
      };
      
      const consultationResponse = await fetch(`http://localhost:${port}/api/consultations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newConsultation)
      });
      
      const consultationData = await consultationResponse.json();
      console.log('✅ Status:', consultationResponse.status);
      console.log('📋 Response:', JSON.stringify(consultationData, null, 2));
    }
    
    console.log('');
    console.log('🎉 PRUEBAS DE POST COMPLETADAS EXITOSAMENTE');
    
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
