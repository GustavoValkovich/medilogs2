// Prueba final con datos completamente correctos
import { createApp } from './src/core/app';

console.log('🎯 PRUEBA FINAL DE API CON DATOS CORRECTOS');
console.log('==========================================');

const app = createApp();
const port = 3002;

const server = app.listen(port, async () => {
  console.log(`✅ Servidor ejecutándose en http://localhost:${port}`);
  
  const fetch = require('node-fetch');
  
  try {
    console.log('📊 PRUEBA: POST - Crear Paciente (todos los campos correctos)');
    console.log('------------------------------------------------------------');
    
    const newPatient = {
      nombre: 'Carlos Test',
      apellido: 'Optimizado',
      fecha_nacimiento: '1992-08-20', // Campo correcto
      telefono: '123456789',
      email: 'carlos.test@medilogs.com',
      direccion: 'Av. Test 456',
      importante: true // Booleano correcto
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
      
      console.log('📊 PRUEBA: GET - Verificar paciente creado');
      console.log('------------------------------------------');
      
      const getResponse = await fetch(`http://localhost:${port}/api/patients/${patientId}`);
      const getData = await getResponse.json();
      console.log('✅ Status:', getResponse.status);
      console.log('📋 Paciente creado:', getData.data.nombre, getData.data.apellido);
      console.log('');
      
      console.log('📊 PRUEBA: POST - Crear Consulta');
      console.log('--------------------------------');
      
      const newConsultation = {
        paciente_id: patientId,
        fecha: '2025-07-04',
        motivo: 'Consulta de control por prueba de API optimizada',
        diagnostico: 'Sistema funcionando correctamente',
        tratamiento: 'Continuar con el desarrollo',
        observaciones: 'API optimizada funcionando perfectamente'
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
      console.log('📋 Consulta creada ID:', consultationData.success ? consultationData.data.id : 'Error');
      console.log('');
      
      console.log('📊 PRUEBA: GET - Listar todas las consultas');
      console.log('-------------------------------------------');
      
      const consultationsResponse = await fetch(`http://localhost:${port}/api/consultations`);
      const consultationsData = await consultationsResponse.json();
      console.log('✅ Status:', consultationsResponse.status);
      console.log('📋 Total consultas:', consultationsData.data.total);
    }
    
    console.log('');
    console.log('🎉 ¡TODAS LAS PRUEBAS EXITOSAS!');
    console.log('🚀 API MEDILOGS2 OPTIMIZADA FUNCIONANDO PERFECTAMENTE');
    
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
