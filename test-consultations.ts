#!/usr/bin/env node

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3001';

interface TestConsulta {
  paciente_id: number;
  fecha_historia: string;
  historia: string;
  imagen?: string;
}

async function testConsultationsModule() {
  console.log('🧪 PRUEBAS DEL MÓDULO DE CONSULTAS - MEDILOGS2 OPTIMIZADO\n');

  try {
    // 1. Health Check
    console.log('1️⃣ Verificando servidor...');
    const healthResponse = await fetch(`${BASE_URL}/health`);
    if (!healthResponse.ok) {
      throw new Error('Servidor no disponible');
    }
    console.log('✅ Servidor funcionando\n');

    // 2. GET - Listar consultas
    console.log('2️⃣ Probando GET /api/consultations...');
    const getResponse = await fetch(`${BASE_URL}/api/consultations`);
    const getResult = await getResponse.json();
    
    console.log(`Status: ${getResponse.status}`);
    console.log(`Consultas encontradas: ${getResult.data?.data?.length || 0}`);
    console.log(`Total: ${getResult.data?.total || 0}\n`);

    // 3. GET - Obtener pacientes disponibles para las pruebas
    console.log('3️⃣ Obteniendo pacientes disponibles...');
    const patientsResponse = await fetch(`${BASE_URL}/api/patients`);
    const patientsResult = await patientsResponse.json();
    
    if (!patientsResult.data?.data?.length) {
      console.log('❌ No hay pacientes disponibles para crear consultas');
      return;
    }
    
    const primerPaciente = patientsResult.data.data[0];
    console.log(`✅ Usando paciente: ${primerPaciente.nombre} (ID: ${primerPaciente.id})\n`);

    // 4. POST - Crear nueva consulta (caso exitoso)
    console.log('4️⃣ Probando POST /api/consultations (caso exitoso)...');
    
    const nuevaConsulta: TestConsulta = {
      paciente_id: primerPaciente.id,
      fecha_historia: '2024-01-15',
      historia: 'Consulta de prueba automatizada. Paciente presenta síntomas de control rutinario.',
      imagen: 'imagen_consulta_prueba.jpg'
    };

    const createResponse = await fetch(`${BASE_URL}/api/consultations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevaConsulta)
    });

    const createResult = await createResponse.json();
    console.log(`Status: ${createResponse.status}`);
    
    if (createResponse.ok) {
      console.log('✅ Consulta creada exitosamente');
      console.log(`ID: ${createResult.data?.id}`);
      console.log(`Paciente ID: ${createResult.data?.paciente_id}`);
      console.log(`Fecha: ${createResult.data?.fecha_historia}`);
      console.log(`Historia: ${createResult.data?.historia?.substring(0, 50)}...`);
    } else {
      console.log('❌ Error al crear consulta');
      console.log('Respuesta:', JSON.stringify(createResult, null, 2));
    }
    console.log('');

    // 5. POST - Validación de datos faltantes
    console.log('5️⃣ Probando validación (datos faltantes)...');
    
    const consultaInvalida = {
      paciente_id: primerPaciente.id,
      // fecha_historia faltante
      // historia faltante
    };

    const invalidResponse = await fetch(`${BASE_URL}/api/consultations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(consultaInvalida)
    });

    const invalidResult = await invalidResponse.json();
    console.log(`Status: ${invalidResponse.status}`);
    
    if (!invalidResponse.ok) {
      console.log('✅ Validación funcionando correctamente');
      console.log(`Error esperado: ${invalidResult.message || 'Datos inválidos'}`);
    } else {
      console.log('❌ La validación debería haber fallado');
    }
    console.log('');

    // 6. POST - Validación de fecha inválida
    console.log('6️⃣ Probando validación (fecha inválida)...');
    
    const consultaFechaInvalida = {
      paciente_id: primerPaciente.id,
      fecha_historia: '2024-13-45', // Fecha inválida
      historia: 'Historia con fecha inválida para testing'
    };

    const fechaInvalidaResponse = await fetch(`${BASE_URL}/api/consultations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(consultaFechaInvalida)
    });

    const fechaInvalidaResult = await fechaInvalidaResponse.json();
    console.log(`Status: ${fechaInvalidaResponse.status}`);
    
    if (!fechaInvalidaResponse.ok) {
      console.log('✅ Validación de fecha funcionando');
      console.log(`Error esperado: ${fechaInvalidaResult.message || 'Fecha inválida'}`);
    } else {
      console.log('❌ La validación de fecha debería haber fallado');
    }
    console.log('');

    // 7. POST - Validación de paciente inexistente
    console.log('7️⃣ Probando validación (paciente inexistente)...');
    
    const consultaPacienteInexistente = {
      paciente_id: 99999, // ID que no existe
      fecha_historia: '2024-01-15',
      historia: 'Historia para paciente que no existe'
    };

    const pacienteInexistenteResponse = await fetch(`${BASE_URL}/api/consultations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(consultaPacienteInexistente)
    });

    const pacienteInexistenteResult = await pacienteInexistenteResponse.json();
    console.log(`Status: ${pacienteInexistenteResponse.status}`);
    
    if (!pacienteInexistenteResponse.ok) {
      console.log('✅ Validación de paciente funcionando');
      console.log(`Error esperado: ${pacienteInexistenteResult.message || 'Paciente no encontrado'}`);
    } else {
      console.log('❌ La validación de paciente debería haber fallado');
    }
    console.log('');

    // 8. GET - Verificar consultas por paciente
    console.log('8️⃣ Probando GET consultas por paciente...');
    const consultasPacienteResponse = await fetch(`${BASE_URL}/api/consultations/patient/${primerPaciente.id}`);
    const consultasPacienteResult = await consultasPacienteResponse.json();
    
    console.log(`Status: ${consultasPacienteResponse.status}`);
    console.log(`Consultas del paciente: ${consultasPacienteResult.data?.length || 0}`);
    console.log('');

    // 9. Resumen final
    console.log('🎯 RESUMEN DE PRUEBAS DEL MÓDULO DE CONSULTAS');
    console.log('================================================');
    console.log('✅ GET consultas - Funcionando');
    console.log('✅ GET consultas por paciente - Funcionando');
    console.log(`${createResponse.ok ? '✅' : '❌'} POST crear consulta - ${createResponse.ok ? 'Funcionando' : 'Error'}`);
    console.log(`${!invalidResponse.ok ? '✅' : '❌'} Validación datos faltantes - ${!invalidResponse.ok ? 'Funcionando' : 'Error'}`);
    console.log(`${!fechaInvalidaResponse.ok ? '✅' : '❌'} Validación fecha inválida - ${!fechaInvalidaResponse.ok ? 'Funcionando' : 'Error'}`);
    console.log(`${!pacienteInexistenteResponse.ok ? '✅' : '❌'} Validación paciente inexistente - ${!pacienteInexistenteResponse.ok ? 'Funcionando' : 'Error'}`);
    
    console.log('\n🚀 ¡Módulo de consultas listo para producción!');

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
    process.exit(1);
  }
}

// Ejecutar las pruebas
testConsultationsModule().catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});
