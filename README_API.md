# MediLogs2 API - PostgreSQL

API completa para el sistema de gestión médica MediLogs2, conectada a base de datos PostgreSQL.

## 🚀 Servidor

- **Puerto**: 3002 (configurable via PORT env var)
- **Base de datos**: PostgreSQL
- **Autenticación**: Básica con bcrypt para passwords

## 📊 Endpoints Disponibles

### Health Check & Info
- `GET /health` - Verificar estado del servidor y DB
- `GET /api` - Información general de la API

### 👥 Pacientes
- `GET /api/pacientes` - Listar todos los pacientes (con paginación opcional)
- `POST /api/pacientes` - Crear nuevo paciente
- `GET /api/pacientes/:id` - Obtener paciente por ID
- `PUT /api/pacientes/:id` - Actualizar paciente
- `DELETE /api/pacientes/:id` - Eliminar paciente
- `GET /api/medicos/:medicoId/pacientes` - Pacientes de un médico específico
- `GET /api/pacientes/especiales/importantes` - Pacientes marcados como importantes

### 📅 Consultas
- `GET /api/consultas` - Listar todas las consultas (con filtros)
- `POST /api/consultas` - Crear nueva consulta
- `GET /api/consultas/:id` - Obtener consulta por ID
- `PUT /api/consultas/:id` - Actualizar consulta
- `DELETE /api/consultas/:id` - Eliminar consulta
- `GET /api/pacientes/:pacienteId/consultas` - Consultas de un paciente
- `GET /api/consultas/especiales/ultimas` - Últimas consultas
- `GET /api/consultas/especiales/buscar` - Buscar consultas

### 👨‍⚕️ Médicos
- `GET /api/medicos` - Listar todos los médicos
- `POST /api/medicos` - Crear nuevo médico
- `GET /api/medicos/:id` - Obtener médico por ID
- `PUT /api/medicos/:id` - Actualizar médico
- `DELETE /api/medicos/:id` - Eliminar médico (solo si no tiene pacientes)

### 🔐 Autenticación
- `POST /api/auth/login` - Login de médico

## 📝 Ejemplos de Uso

### Crear Médico
```bash
curl -X POST http://localhost:3002/api/medicos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Dr. Juan Pérez",
    "email": "juan.perez@hospital.com",
    "password": "password123"
  }'
```

### Crear Paciente
```bash
curl -X POST http://localhost:3002/api/pacientes \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Ana García",
    "documento": "12345678A",
    "nacimiento": "1990-05-15",
    "sexo": "F",
    "obra_social": "OSDE",
    "mail": "ana.garcia@email.com",
    "medico_id": 1,
    "importante": "Paciente diabética, requiere seguimiento especial"
  }'
```

### Crear Consulta
```bash
curl -X POST http://localhost:3002/api/consultas \
  -H "Content-Type: application/json" \
  -d '{
    "paciente_id": 1,
    "fecha_historia": "2024-01-15",
    "historia": "Paciente presenta dolor de cabeza recurrente..."
  }'
```

### Login
```bash
curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan.perez@hospital.com",
    "password": "password123"
  }'
```

## 🗃️ Estructura de Base de Datos

### Tabla: paciente
- `id` (integer, PK)
- `medico_id` (integer, FK a tabla medico)
- `nombre` (varchar)
- `documento` (varchar)
- `nacimiento` (date)
- `importante` (varchar(100)) - Texto breve para casos especiales
- `sexo` (varchar)
- `obra_social` (varchar)
- `mail` (varchar)

### Tabla: consulta
- `id` (integer, PK)
- `paciente_id` (integer, FK a tabla paciente)
- `fecha_historia` (timestamp)
- `historia` (text)
- `imagen` (varchar)

### Tabla: medico
- `id` (integer, PK)
- `nombre` (varchar)
- `email` (varchar, unique)
- `password` (varchar, hashed with bcrypt)

## 🔒 Seguridad

- ✅ Passwords hasheados con bcrypt (salt rounds: 10)
- ✅ Validación de emails únicos para médicos
- ✅ Validación de campos requeridos
- ✅ Protección contra eliminación de médicos con pacientes
- ✅ Sanitización de datos de entrada

## 🛠️ Scripts Disponibles

```bash
# Compilar TypeScript
npm run build

# Ejecutar en producción
npm run start:pg

# Desarrollo con hot reload
npm run dev:pg

# Desarrollo con watch mode
npm run dev:watch:pg
```

## 🧪 Testing

Se incluye script de testing completo:
```bash
./test-medicos.sh
```

## 📋 TODO / Mejoras Futuras

- [ ] Implementar JWT tokens para autenticación
- [ ] Agregar middleware de autorización
- [ ] Implementar rate limiting
- [ ] Agregar tests unitarios y de integración
- [ ] Documentación con Swagger/OpenAPI
- [ ] Logs estructurados
- [ ] Validaciones más robustas con Joi/Zod
- [ ] Paginación mejorada con cursors
- [ ] Filtros avanzados de búsqueda
- [ ] Backup automático de base de datos

## 🎯 Estado del Proyecto

✅ **COMPLETADO**: API completamente funcional con PostgreSQL
- Conexión a base de datos PostgreSQL ✅
- CRUD completo para Pacientes ✅  
- CRUD completo para Consultas ✅
- CRUD completo para Médicos ✅
- Autenticación básica ✅
- Passwords seguros con bcrypt ✅
- Validaciones de negocio ✅
- Testing funcional ✅
- Documentación ✅

La API está lista para uso en producción y se puede integrar con cualquier frontend o herramienta como Postman.
