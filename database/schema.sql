-- Crear base de datos (ejecutar como superusuario)
-- CREATE DATABASE medilogs2;

-- Conectarse a la base de datos medilogs2 y ejecutar lo siguiente:

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de pacientes
CREATE TABLE IF NOT EXISTS pacientes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    edad INTEGER NOT NULL CHECK (edad >= 0 AND edad <= 150),
    fecha_nacimiento DATE NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100),
    direccion TEXT,
    numero_documento VARCHAR(50) NOT NULL UNIQUE,
    tipo_documento VARCHAR(20) NOT NULL CHECK (tipo_documento IN ('DNI', 'PASAPORTE', 'CEDULA', 'OTRO')),
    sexo VARCHAR(20) NOT NULL CHECK (sexo IN ('MASCULINO', 'FEMENINO', 'OTRO')),
    grupo_sanguineo VARCHAR(5) CHECK (grupo_sanguineo IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    alergias TEXT[],
    medicamentos_actuales TEXT[],
    enfermedades_cronicas TEXT[],
    contacto_emergencia JSONB,
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de consultas médicas
CREATE TABLE IF NOT EXISTS consultas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME,
    motivo TEXT NOT NULL,
    sintomas TEXT[],
    signos_vitales JSONB,
    diagnostico TEXT,
    tratamiento TEXT,
    medicamentos_recetados JSONB,
    observaciones TEXT,
    proxima_cita DATE,
    estado VARCHAR(20) NOT NULL DEFAULT 'PROGRAMADA' 
        CHECK (estado IN ('PROGRAMADA', 'EN_CURSO', 'COMPLETADA', 'CANCELADA', 'NO_ASISTIO')),
    medico VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_pacientes_documento ON pacientes(numero_documento);
CREATE INDEX IF NOT EXISTS idx_pacientes_activo ON pacientes(activo);
CREATE INDEX IF NOT EXISTS idx_pacientes_email ON pacientes(email);
CREATE INDEX IF NOT EXISTS idx_consultas_paciente_id ON consultas(paciente_id);
CREATE INDEX IF NOT EXISTS idx_consultas_fecha ON consultas(fecha);
CREATE INDEX IF NOT EXISTS idx_consultas_estado ON consultas(estado);
CREATE INDEX IF NOT EXISTS idx_consultas_medico ON consultas(medico);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_pacientes_updated_at 
    BEFORE UPDATE ON pacientes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_consultas_updated_at 
    BEFORE UPDATE ON consultas 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insertar datos de ejemplo (opcional)
INSERT INTO pacientes (
    nombre, apellido, edad, fecha_nacimiento, telefono, email, 
    numero_documento, tipo_documento, sexo, grupo_sanguineo,
    alergias, medicamentos_actuales, enfermedades_cronicas,
    contacto_emergencia
) VALUES (
    'Juan Carlos', 'Pérez García', 45, '1979-01-15', '+54-11-1234-5678', 
    'juan.perez@email.com', '12345678', 'DNI', 'MASCULINO', 'O+',
    ARRAY['polen', 'frutos secos'], 
    ARRAY['Ibuprofeno 400mg'],
    ARRAY['Hipertensión'],
    '{"nombre": "María Pérez", "telefono": "+54-11-8765-4321", "relacion": "Esposa"}'::jsonb
) ON CONFLICT (numero_documento) DO NOTHING;

-- Ver las tablas creadas
\dt
