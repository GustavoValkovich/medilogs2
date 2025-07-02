# 📋 Guía para Probar la API MediLogs2 en Postman

## 🚀 Servidor Funcionando

**URL Base:** `http://localhost:3001`

## 📖 Configuración Inicial en Postman

### 1. Crear Nueva Colección
- Abre Postman
- Clic en "New" → "Collection"
- Nombre: "MediLogs2 API"

### 2. Configurar Variable de Entorno
- Clic en el ⚙️ (Settings)
- "Environment" → "Add"
- Nombre: "MediLogs2 Local"
- Variable: `base_url` = `http://localhost:3001`

## 🏥 ENDPOINTS PARA PACIENTES

### 📝 1. Crear Paciente
```
POST {{base_url}}/api/pacientes
Content-Type: application/json

{
  "nombre": "Juan Carlos",
  "apellido": "Pérez García",
  "edad": 45,
  "fechaNacimiento": "1979-01-15",
  "telefono": "+54-11-1234-5678",
  "email": "juan.perez@email.com",
  "direccion": "Av. Corrientes 1234, CABA",
  "numeroDocumento": "12345678",
  "tipoDocumento": "DNI",
  "sexo": "MASCULINO",
  "grupoSanguineo": "O+",
  "alergias": ["polen", "frutos secos"],
  "medicamentosActuales": ["Ibuprofeno 400mg"],
  "enfermedadesCronicas": ["Hipertensión"],
  "contactoEmergencia": {
    "nombre": "María Pérez",
    "telefono": "+54-11-8765-4321",
    "relacion": "Esposa"
  }
}
```

### 👥 2. Obtener Todos los Pacientes
```
GET {{base_url}}/api/pacientes
```

### 👤 3. Obtener Paciente por ID
```
GET {{base_url}}/api/pacientes/1
```

### ✏️ 4. Actualizar Paciente
```
PUT {{base_url}}/api/pacientes/1
Content-Type: application/json

{
  "telefono": "+54-11-9999-8888",
  "email": "nuevo.email@email.com"
}
```

### 🗑️ 5. Eliminar Paciente
```
DELETE {{base_url}}/api/pacientes/1
```

## 📅 ENDPOINTS PARA CONSULTAS

### 📝 1. Crear Consulta
```
POST {{base_url}}/api/consultas
Content-Type: application/json

{
  "pacienteId": "1",
  "fecha": "2025-07-02",
  "horaInicio": "10:00",
  "motivo": "Control rutinario anual",
  "sintomas": ["dolor de cabeza leve", "fatiga"],
  "signosVitales": {
    "presionArterial": "120/80",
    "frecuenciaCardiaca": 72,
    "temperatura": 36.5,
    "peso": 75.5,
    "altura": 175,
    "saturacionOxigeno": 98
  },
  "medico": "Dr. García López"
}
```

### 📋 2. Obtener Todas las Consultas
```
GET {{base_url}}/api/consultas
```

### 📄 3. Obtener Consulta por ID
```
GET {{base_url}}/api/consultas/1
```

### 👥 4. Obtener Consultas de un Paciente
```
GET {{base_url}}/api/pacientes/1/consultas
```

### ✏️ 5. Actualizar Consulta (Agregar Diagnóstico)
```
PUT {{base_url}}/api/consultas/1
Content-Type: application/json

{
  "diagnostico": "Cefalea tensional",
  "tratamiento": "Descanso y relajación",
  "medicamentosRecetados": [
    {
      "nombre": "Ibuprofeno",
      "dosis": "400mg",
      "frecuencia": "Cada 8 horas",
      "duracion": "3 días",
      "instrucciones": "Tomar con alimentos"
    }
  ],
  "observaciones": "Paciente presenta mejora durante la consulta",
  "proximaCita": "2025-08-02",
  "horaFin": "10:30"
}
```

### 🔄 6. Cambiar Estado de Consulta
```
PATCH {{base_url}}/api/consultas/1/estado
Content-Type: application/json

{
  "estado": "COMPLETADA"
}
```

**Estados disponibles:**
- `PROGRAMADA`
- `EN_CURSO`
- `COMPLETADA`
- `CANCELADA`
- `NO_ASISTIO`

### 🗑️ 7. Eliminar Consulta
```
DELETE {{base_url}}/api/consultas/1
```

## 🔧 ENDPOINTS DE UTILIDAD

### ❤️ Health Check
```
GET {{base_url}}/health
```

### 📊 Información de la API
```
GET {{base_url}}/api
```

## 📋 FLUJO DE PRUEBA COMPLETO

### Paso 1: Verificar que la API funciona
```
GET {{base_url}}/health
```

### Paso 2: Crear un paciente
```
POST {{base_url}}/api/pacientes
(con el JSON de ejemplo de arriba)
```

### Paso 3: Verificar que se creó
```
GET {{base_url}}/api/pacientes
```

### Paso 4: Crear una consulta para ese paciente
```
POST {{base_url}}/api/consultas
(usar el ID del paciente creado)
```

### Paso 5: Ver las consultas del paciente
```
GET {{base_url}}/api/pacientes/1/consultas
```

### Paso 6: Completar la consulta
```
PUT {{base_url}}/api/consultas/1
(agregar diagnóstico y tratamiento)
```

### Paso 7: Cambiar estado a completada
```
PATCH {{base_url}}/api/consultas/1/estado
{
  "estado": "COMPLETADA"
}
```

## ✅ RESPUESTAS ESPERADAS

### ✓ Éxito (200/201)
```json
{
  "success": true,
  "data": { ... },
  "message": "Operación exitosa"
}
```

### ❌ Error (400/404/409)
```json
{
  "success": false,
  "error": "Descripción del error"
}
```

## 🎯 TIPS PARA POSTMAN

1. **Usar Variables**: Crea variables para `paciente_id` y `consulta_id`
2. **Tests**: Agrega tests para verificar status codes
3. **Environments**: Mantén entornos para local/desarrollo/producción
4. **Collections**: Organiza los requests por funcionalidad

## 🚀 ¡EMPIEZA A PROBAR!

1. Asegúrate de que el servidor esté corriendo en puerto 3001
2. Importa los endpoints en Postman
3. ¡Comienza con el health check!

La API está lista para probar todas las funcionalidades médicas de MediLogs2. 🏥✨
