# 🗄️ Configuración de Base de Datos para MediLogs2

## 🚀 Opción 1: PostgreSQL (Recomendado para Producción)

### Instalación de PostgreSQL

#### macOS (con Homebrew):
```bash
# Instalar PostgreSQL
brew install postgresql@15

# Iniciar servicio
brew services start postgresql@15

# Crear usuario y base de datos
psql postgres
```

#### En psql:
```sql
-- Crear usuario
CREATE USER medilogs_user WITH PASSWORD 'medilogs_password';

-- Crear base de datos
CREATE DATABASE medilogs2 OWNER medilogs_user;

-- Dar permisos
GRANT ALL PRIVILEGES ON DATABASE medilogs2 TO medilogs_user;

-- Salir
\q
```

### Configurar .env:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=medilogs2
DB_USER=medilogs_user
DB_PASSWORD=medilogs_password
```

### Crear tablas:
```bash
psql -d medilogs2 -U medilogs_user -f database/schema.sql
```

## 🔧 Opción 2: SQLite (Desarrollo Rápido)

### Ventajas:
- ✅ No requiere instalación de servidor
- ✅ Perfecto para desarrollo
- ✅ Fácil de configurar
- ✅ Base de datos en archivo

### Instalar dependencias:
```bash
npm install sqlite3 @types/sqlite3
```

## 🏥 Opción 3: Base de Datos en Memoria (Solo Pruebas)

Si solo quieres probar la API sin configurar base de datos, usa:
```bash
npm run dev:memory
```

## 🔍 Verificar Conexión

### PostgreSQL:
```bash
psql -d medilogs2 -U medilogs_user -c "SELECT version();"
```

### Probar API:
```bash
curl http://localhost:3001/health
```

## 🐳 Opción 4: Docker (Más Fácil)

### docker-compose.yml:
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: medilogs2
      POSTGRES_USER: medilogs_user
      POSTGRES_PASSWORD: medilogs_password
    ports:
      - "5432:5432"
    volumes:
      - ./database/schema.sql:/docker-entrypoint-initdb.d/schema.sql
```

### Iniciar:
```bash
docker-compose up -d
```

## 🎯 ¿Qué Opción Elegir?

- **🏥 Producción**: PostgreSQL
- **🔧 Desarrollo**: SQLite o PostgreSQL con Docker
- **🧪 Pruebas rápidas**: En memoria

## 📋 Estado Actual

Tu API ya está configurada para PostgreSQL. Solo necesitas:

1. **Instalar PostgreSQL** (o usar Docker)
2. **Crear la base de datos** con el script schema.sql
3. **Actualizar .env** con las credenciales correctas
4. **Reiniciar la API**

¿Prefieres que configure SQLite para desarrollo más rápido?
