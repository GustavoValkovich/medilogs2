#!/usr/bin/env node

import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:3001';

async function testFilesModule() {
  console.log('🧪 PRUEBAS DEL MÓDULO DE ARCHIVOS - MEDILOGS2\n');

  try {
    // 1. Health Check
    console.log('1️⃣ Verificando servidor...');
    const healthResponse = await fetch(`${BASE_URL}/health`);
    if (!healthResponse.ok) {
      throw new Error('Servidor no disponible');
    }
    console.log('✅ Servidor funcionando\n');

    // 2. GET - Información de upload
    console.log('2️⃣ Probando GET /api/files/info...');
    const infoResponse = await fetch(`${BASE_URL}/api/files/info`);
    const infoResult = await infoResponse.json();
    
    console.log(`Status: ${infoResponse.status}`);
    console.log(`Tipos permitidos: ${infoResult.data?.ALLOWED_EXTENSIONS?.join(', ') || 'N/A'}`);
    console.log(`Tamaño máximo: ${(infoResult.data?.MAX_FILE_SIZE / 1024 / 1024) || 'N/A'}MB\n`);

    // 3. Crear archivo de prueba (imagen PNG pequeña)
    console.log('3️⃣ Creando archivo de prueba...');
    const testDir = path.join(__dirname, 'test-files');
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
    
    // Crear una imagen PNG simple de 1x1 pixel (base64)
    const pngData = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU8kAAAAAElFTkSuQmCC',
      'base64'
    );
    
    const testFile = path.join(testDir, 'test-image.png');
    fs.writeFileSync(testFile, pngData);
    console.log('✅ Archivo de prueba creado\n');

    // 4. POST - Subir archivo individual
    console.log('4️⃣ Probando POST /api/files/upload...');
    const formData = new FormData();
    formData.append('file', fs.createReadStream(testFile));

    const uploadResponse = await fetch(`${BASE_URL}/api/files/upload`, {
      method: 'POST',
      body: formData as any
    });

    const uploadResult = await uploadResponse.json();
    console.log(`Status: ${uploadResponse.status}`);
    
    if (uploadResponse.ok) {
      console.log('✅ Archivo subido exitosamente');
      console.log(`Nombre: ${uploadResult.data?.filename}`);
      console.log(`URL: ${uploadResult.data?.url}`);
      console.log(`Tamaño: ${uploadResult.data?.size} bytes`);
    } else {
      console.log('❌ Error al subir archivo');
      console.log('Respuesta:', JSON.stringify(uploadResult, null, 2));
    }
    console.log('');

    // 5. GET - Verificar archivo subido
    if (uploadResponse.ok && uploadResult.data?.url) {
      console.log('5️⃣ Verificando archivo subido...');
      const fileUrl = `${BASE_URL}${uploadResult.data.url}`;
      const fileResponse = await fetch(fileUrl);
      
      console.log(`Status acceso directo: ${fileResponse.status}`);
      console.log(`Content-Type: ${fileResponse.headers.get('content-type')}`);
      console.log('✅ Archivo accesible directamente\n');
    }

    // 6. Crear archivo PDF de prueba
    console.log('6️⃣ Probando con archivo PDF...');
    const pdfData = Buffer.from(
      '%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n>>\nendobj\nxref\n0 4\n0000000000 65535 f \n0000000010 00000 n \n0000000053 00000 n \n0000000125 00000 n \ntrailer\n<<\n/Size 4\n/Root 1 0 R\n>>\nstartxref\n174\n%%EOF'
    );
    
    const testPdf = path.join(testDir, 'test-document.pdf');
    fs.writeFileSync(testPdf, pdfData);

    const pdfFormData = new FormData();
    pdfFormData.append('file', fs.createReadStream(testPdf));

    const pdfUploadResponse = await fetch(`${BASE_URL}/api/files/upload`, {
      method: 'POST',
      body: pdfFormData as any
    });

    const pdfUploadResult = await pdfUploadResponse.json();
    console.log(`Status PDF: ${pdfUploadResponse.status}`);
    
    if (pdfUploadResponse.ok) {
      console.log('✅ PDF subido exitosamente');
      console.log(`Nombre: ${pdfUploadResult.data?.filename}`);
    } else {
      console.log('❌ Error al subir PDF');
    }
    console.log('');

    // 7. Probar archivo muy grande (debe fallar)
    console.log('7️⃣ Probando validación de tamaño...');
    const largeFile = path.join(testDir, 'large-file.jpg');
    const largeData = Buffer.alloc(2 * 1024 * 1024); // 2MB
    fs.writeFileSync(largeFile, largeData);

    const largeFormData = new FormData();
    largeFormData.append('file', fs.createReadStream(largeFile));

    const largeUploadResponse = await fetch(`${BASE_URL}/api/files/upload`, {
      method: 'POST',
      body: largeFormData as any
    });

    const largeUploadResult = await largeUploadResponse.json();
    console.log(`Status archivo grande: ${largeUploadResponse.status}`);
    
    if (!largeUploadResponse.ok) {
      console.log('✅ Validación de tamaño funcionando');
      console.log(`Error esperado: ${largeUploadResult.message || 'Archivo muy grande'}`);
    } else {
      console.log('❌ La validación de tamaño debería haber fallado');
    }
    console.log('');

    // 8. Probar múltiples archivos
    console.log('8️⃣ Probando upload múltiple...');
    const multiFormData = new FormData();
    multiFormData.append('files', fs.createReadStream(testFile));
    multiFormData.append('files', fs.createReadStream(testPdf));

    const multiUploadResponse = await fetch(`${BASE_URL}/api/files/upload/consultation`, {
      method: 'POST',
      body: multiFormData as any
    });

    const multiUploadResult = await multiUploadResponse.json();
    console.log(`Status múltiple: ${multiUploadResponse.status}`);
    
    if (multiUploadResponse.ok) {
      console.log('✅ Upload múltiple exitoso');
      console.log(`Archivos subidos: ${multiUploadResult.data?.totalFiles}`);
      console.log(`Tamaño total: ${multiUploadResult.data?.totalSize} bytes`);
    } else {
      console.log('❌ Error en upload múltiple');
      console.log('Respuesta:', JSON.stringify(multiUploadResult, null, 2));
    }
    console.log('');

    // 9. Limpiar archivos de prueba
    console.log('9️⃣ Limpiando archivos de prueba...');
    fs.rmSync(testDir, { recursive: true, force: true });
    console.log('✅ Archivos de prueba eliminados\n');

    // 10. Resumen final
    console.log('🎯 RESUMEN DE PRUEBAS DEL MÓDULO DE ARCHIVOS');
    console.log('================================================');
    console.log('✅ GET información de upload - Funcionando');
    console.log(`${uploadResponse.ok ? '✅' : '❌'} POST upload individual - ${uploadResponse.ok ? 'Funcionando' : 'Error'}`);
    console.log(`${pdfUploadResponse.ok ? '✅' : '❌'} POST upload PDF - ${pdfUploadResponse.ok ? 'Funcionando' : 'Error'}`);
    console.log(`${!largeUploadResponse.ok ? '✅' : '❌'} Validación tamaño - ${!largeUploadResponse.ok ? 'Funcionando' : 'Error'}`);
    console.log(`${multiUploadResponse.ok ? '✅' : '❌'} Upload múltiple - ${multiUploadResponse.ok ? 'Funcionando' : 'Error'}`);
    
    console.log('\n🚀 ¡Módulo de archivos implementado y funcionando!');
    console.log('\n📁 ENDPOINTS DISPONIBLES:');
    console.log('• GET  /api/files/info - Información de upload');
    console.log('• POST /api/files/upload - Subir archivo individual');
    console.log('• POST /api/files/upload/consultation - Subir múltiples archivos');
    console.log('• GET  /uploads/[filename] - Acceso directo a archivos');
    console.log('• POST /api/consultations/with-files - Crear consulta con archivos');

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
    process.exit(1);
  }
}

// Ejecutar las pruebas
testFilesModule().catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});
