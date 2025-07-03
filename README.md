# 🚀 MediLogs2 - Sistema de Gestión Médica Optimizado

Una aplicación moderna de gestión médica construida con Node.js, TypeScript y Express, optimizada para rendimiento, seguridad y mantenibilidad.

## ✨ Características Principales

- 🔒 **Seguridad Avanzada**: Helmet, Rate Limiting, validación de entrada
- 📊 **Logging Estructurado**: Sistema de logs centralizado y eficiente
- 🚀 **Gestión Automática de Puertos**: Sin conflictos EADDRINUSE
- 💾 **Base de Datos Flexible**: PostgreSQL con fallback a SQLite
- 🧩 **Arquitectura Modular**: Código organizado por funcionalidad
- ⚡ **Optimizaciones de Rendimiento**: Compresión, conexiones pooled
- 🔄 **Auto-restart**: Servidor que se reinicia automáticamente

## 📁 Estructura del Proyecto

```
src/
├── core/                 # Núcleo de la aplicación
│   ├── app.ts           # Aplicación Express principal
│   ├── config.ts        # Configuración centralizada
│   └── server.ts        # Servidor con gestión de puertos
├── database/            # Gestión de base de datos
│   └── connection.ts    # Conexión unificada (PostgreSQL/SQLite)
├── modules/             # Módulos por funcionalidad
│   ├── auth/           # Autenticación
│   ├── patients/       # Gestión de pacientes
│   ├── consultations/  # Consultas médicas
│   └── doctors/        # Gestión de médicos
├── shared/              # Utilidades compartidas
│   ├── middleware/     # Middlewares reutilizables
│   └── utils/          # Utilidades helper
└── types/               # Tipos TypeScript
```

## 🚀 Inicio Rápido

### Prerequisitos

- Node.js 18+ 
- PostgreSQL (opcional, usa SQLite como fallback)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/GustavoValkovich/medilogs2.git
cd medilogs2

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env según tus necesidades
```

### Configuración de Base de Datos

El sistema detecta automáticamente qué base de datos usar:

**PostgreSQL (Recomendado para producción):**
```bash
# .env
DATABASE_TYPE=postgresql
DATABASE_URL=postgresql://usuario:password@localhost:5432/medilogs2
```

**SQLite (Desarrollo/Fallback automático):**
```bash
# .env
DATABASE_TYPE=sqlite
DATABASE_URL=./database/medilogs2.db
```

### Ejecución

```bash
# Desarrollo con hot-reload
npm run dev

# Desarrollo con limpieza previa
npm run dev:clean

# Modo watch (reinicio automático)
npm run dev:watch

# Producción
npm run build
npm run start

# Producción optimizada
npm run start:prod
```

## 📚 API Endpoints

### 🔒 Autenticación
- `POST /api/auth/login` - Login de médicos
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/me` - Info del usuario actual

### 👥 Pacientes
- `GET /api/patients` - Listar pacientes (con paginación)
- `POST /api/patients` - Crear paciente
- `GET /api/patients/:id` - Obtener paciente
- `PUT /api/patients/:id` - Actualizar paciente
- `DELETE /api/patients/:id` - Eliminar paciente
- `GET /api/patients/important` - Pacientes importantes
- `GET /api/patients/by-doctor/:doctorId` - Pacientes por médico

### 👨‍⚕️ Médicos
- `GET /api/doctors` - Listar médicos
- `POST /api/doctors` - Crear médico
- `GET /api/doctors/:id` - Obtener médico
- `PUT /api/doctors/:id` - Actualizar médico
- `DELETE /api/doctors/:id` - Eliminar médico

### 📋 Consultas
- `GET /api/consultations` - Listar consultas (con paginación)
- `POST /api/consultations` - Crear consulta
- `GET /api/consultations/:id` - Obtener consulta
- `PUT /api/consultations/:id` - Actualizar consulta
- `DELETE /api/consultations/:id` - Eliminar consulta
- `GET /api/consultations/recent` - Últimas consultas
- `GET /api/consultations/search?search=term` - Buscar consultas
- `GET /api/consultations/by-patient/:patientId` - Consultas por paciente

### 🏥 Sistema
- `GET /health` - Health check
- `GET /api` - Información de la API

## 🔧 Configuración Avanzada

### Variables de Entorno

```bash
# Servidor
NODE_ENV=development|production
PORT=3000
API_PREFIX=/api

# Base de datos
DATABASE_TYPE=postgresql|sqlite
DATABASE_URL=...
DB_POOL_MIN=2
DB_POOL_MAX=10

# Logging
LOG_LEVEL=debug|info|warn|error

# Seguridad
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Características de Seguridad

- **Helmet**: Headers de seguridad HTTP
- **CORS**: Configuración de orígenes permitidos
- **Rate Limiting**: Protección contra ataques de fuerza bruta
- **Validación de Input**: Sanitización automática de datos
- **Error Handling**: Manejo seguro de errores sin exposición de información

### Optimizaciones de Rendimiento

- **Compresión Gzip**: Respuestas comprimidas automáticamente
- **Connection Pooling**: Pool de conexiones de base de datos optimizado
- **Request Logging**: Logging eficiente con información de rendimiento
- **Memory Management**: Gestión optimizada de memoria

## 🧪 Testing

```bash
# Ejecutar tests (cuando estén configurados)
npm test

# Verificación de tipos
npm run type-check

# Linting (cuando esté configurado)
npm run lint
```

## 🐳 Docker

```bash
# Construir imagen
npm run docker:build

# Ejecutar contenedor
npm run docker:run
```

## 🚀 Deployment

### Producción Local
```bash
npm run build
NODE_ENV=production npm start
```

### Consideraciones de Producción

1. **Base de Datos**: Usar PostgreSQL en producción
2. **Variables de Entorno**: Configurar todas las variables necesarias
3. **Logging**: Configurar nivel de logs apropiado
4. **Seguridad**: Revisar configuración de CORS y Rate Limiting
5. **Monitoreo**: Usar el endpoint `/health` para health checks

## 📊 Monitoreo

El sistema incluye:

- **Health Checks**: Endpoint `/health` con estado de DB y métricas
- **Request Logging**: Logs estructurados de todas las requests
- **Error Tracking**: Logging centralizado de errores
- **Performance Metrics**: Tiempos de respuesta y uso de memoria

## 🤝 Desarrollo

### Agregando Nuevos Módulos

1. Crear directorio en `src/modules/nuevo-modulo/`
2. Implementar controlador, rutas y validaciones
3. Exportar en `src/modules/index.ts`
4. Agregar rutas en `src/core/app.ts`

### Buenas Prácticas

- Usar `asyncHandler` para controladores async
- Implementar validación con esquemas reutilizables
- Usar el logger modular para debugging
- Seguir la estructura de respuestas API consistente

## 📄 Licencia

ISC

## 🔗 Links Útiles

- [Documentación API (Postman)](./MediLogs2_API_Postman_Collection.json)
- [Guía de Base de Datos](./DATABASE-SETUP.md)
- [Changelog](./CHANGELOG_IMPORTANTE.md)
- [Plan de Optimización](./OPTIMIZATION.md)

---

**MediLogs2** - Sistema de gestión médica moderno, seguro y escalable. 🏥✨
