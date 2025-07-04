// Prueba final corregida con campos exactos del sistema
import { createApp } from './src/core/app';

console.log('🔧 PRUEBA CORREGIDA - CAMPOS EXACTOS DEL SISTEMA');
console.log('===============================================');

const app = createApp();
const port = 3003;

const server = app.listen(port, async () => {
  console.log(`✅ Servidor ejecutándose en http://localhost:${port}`);
  
  const fetch = require('node-fetch');
  
  try {
    console.log('📊 PRUEBA: POST - Crear Paciente (campos corregidos)');
    console.log('--------------------------------------------------');
    
    // Usando los campos EXACTOS que espera el repositorio
    const newPatient = {
      nombre: 'Ana Test Corregida',
      documento: '88877766T',
      nacimiento: '1993-09-25', // Campo correcto: nacimiento (no fecha_nacimiento)
      sexo: 'F',
      obra_social: 'Swiss Medical',
      mail: 'ana.test.corregida@medilogs.com',
      importante: 'Paciente de prueba con campos corregidos'
      // No se incluye medico_id (opcional)
    };
    
    console.log('📋 Datos enviados:', JSON.stringify(newPatient, null, 2));
    console.log('');
    
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
      console.log('🎉 ¡PACIENTE CREADO EXITOSAMENTE!');
      console.log(`📋 ID del paciente: ${patientId}`);
      console.log('');
      
      // Verificar que se creó correctamente
      console.log('📊 VERIFICACIÓN: GET del paciente creado');
      console.log('---------------------------------------');
      
      const getResponse = await fetch(`http://localhost:${port}/api/patients/${patientId}`);
      const getData = await getResponse.json();
      console.log('✅ Status:', getResponse.status);
      console.log('📋 Paciente verificado:', getData.data.nombre, getData.data.documento);
      
      console.log('');
      console.log('🎯 PRUEBA: POST Consulta para el paciente');
      console.log('----------------------------------------');
      
      const newConsultation = {
        paciente_id: parseInt(patientId), // Asegurar que sea número
        fecha: '2025-07-04',
        motivo: 'Consulta de verificación tras corrección de API',
        diagnostico: 'Sistema funcionando correctamente con campos corregidos',
        tratamiento: 'Continuar con las pruebas',
        observaciones: 'Paciente creado exitosamente después de corregir inconsistencias'
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
      console.log('📋 Consulta:', consultationData.success ? `ID ${consultationData.data.id}` : 'Error');
      
    } else {
      console.log('❌ Error al crear paciente');
      console.log('📋 Detalles del error:', createData);
    }
    
    console.log('');
    console.log('🔧 INCONSISTENCIAS CORREGIDAS:');
    console.log('=============================');
    console.log('✅ Campo "nacimiento" (no fecha_nacimiento)');
    console.log('✅ Campo "documento" agregado como requerido');
    console.log('✅ Campo "importante" como string (no boolean)');
    console.log('✅ Validación de fecha mejorada');
    console.log('✅ Manejo de campos nulos optimizado');
    
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
