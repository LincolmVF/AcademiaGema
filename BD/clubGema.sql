-- 1. CONFIGURACIÓN DE ROLES Y USUARIOS (NÚCLEO)
-- ==================================================================================

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL -- Ej: 'ADMIN', 'PROFESOR', 'ALUMNO'
);

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    rol_id INT NOT NULL REFERENCES roles(id),
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE credenciales_usuario (
    usuario_id INT PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
    hash_contrasena VARCHAR(255) NOT NULL,
    ultimo_login TIMESTAMP,
    intentos_fallidos INT DEFAULT 0,
    bloqueado BOOLEAN DEFAULT FALSE,
    contrasena_actualizada_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. PERFILES ESPECÍFICOS (EXTENSIONES)
-- ==================================================================================

CREATE TABLE alumnos (
    usuario_id INT PRIMARY KEY REFERENCES usuarios(id),
    contacto_emergencia_nombre VARCHAR(100),
    contacto_emergencia_telefono VARCHAR(20),
    condiciones_medicas TEXT,
    fecha_nacimiento DATE
);

CREATE TABLE profesores (
    usuario_id INT PRIMARY KEY REFERENCES usuarios(id),
    especializacion VARCHAR(100),
    tarifa_hora DECIMAL(10, 2)
);

-- 3. INFRAESTRUCTURA Y ACADÉMICA (GEOGRAFÍA ACTUALIZADA)
-- ==================================================================================

-- Nueva Tabla de Direcciones (Normalización)
CREATE TABLE direcciones (
    id SERIAL PRIMARY KEY,
    calle_principal VARCHAR(255) NOT NULL,
    calle_secundaria VARCHAR(255), -- Intersección o referencia
    ciudad VARCHAR(100) NOT NULL,
    estado_provincia VARCHAR(100), -- Departamento / Provincia
    codigo_postal VARCHAR(20),
    pais VARCHAR(50) DEFAULT 'Peru',
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sedes (
    id SERIAL PRIMARY KEY,
    direccion_id INT NOT NULL REFERENCES direcciones(id), -- Vinculación
    nombre VARCHAR(100) NOT NULL, -- Ej: 'Sede Norte'
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE canchas (
    id SERIAL PRIMARY KEY,
    sede_id INT NOT NULL REFERENCES sedes(id),
    nombre VARCHAR(50) NOT NULL, -- Ej: 'Cancha 1 - Techada'
    descripcion VARCHAR(200)
);

CREATE TABLE niveles_entrenamiento (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL, -- Ej: 'Principiante', 'Intermedio'
    precio_mensual DECIMAL(10, 2) NOT NULL
);

CREATE TABLE horarios_clases (
    id SERIAL PRIMARY KEY,
    sede_id INT NOT NULL REFERENCES sedes(id),
    cancha_id INT REFERENCES canchas(id),
    profesor_id INT NOT NULL REFERENCES profesores(usuario_id),
    nivel_id INT NOT NULL REFERENCES niveles_entrenamiento(id),
    dia_semana INT NOT NULL CHECK (dia_semana BETWEEN 1 AND 7), -- 1=Lunes
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    capacidad_max INT DEFAULT 20,
    activo BOOLEAN DEFAULT TRUE,
    CONSTRAINT unica_cancha_hora UNIQUE (cancha_id, dia_semana, hora_inicio)
);

-- 4. OPERACIONES (INSCRIPCIONES Y ASISTENCIA)
-- ==================================================================================

CREATE TABLE inscripciones (
    id SERIAL PRIMARY KEY,
    alumno_id INT NOT NULL REFERENCES alumnos(usuario_id),
    horario_id INT NOT NULL REFERENCES horarios_clases(id),
    fecha_inscripcion DATE DEFAULT CURRENT_DATE,
    estado VARCHAR(20) DEFAULT 'ACTIVO' CHECK (estado IN ('ACTIVO', 'SUSPENDIDO', 'RETIRADO')),
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unica_inscripcion_alumno UNIQUE (alumno_id, horario_id)
);

CREATE TABLE registros_asistencia (
    id SERIAL PRIMARY KEY,
    inscripcion_id INT NOT NULL REFERENCES inscripciones(id),
    fecha DATE NOT NULL,
    estado VARCHAR(20) DEFAULT 'PRESENTE' CHECK (estado IN ('PRESENTE', 'AUSENTE', 'TARDE', 'JUSTIFICADO')),
    registrado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT asistencia_unica_diaria UNIQUE (inscripcion_id, fecha)
);

-- 5. FINANZAS (FACTURACIÓN Y COBRANZA)
-- ==================================================================================

CREATE TABLE cuentas_por_cobrar (
    id SERIAL PRIMARY KEY,
    alumno_id INT NOT NULL REFERENCES alumnos(usuario_id),
    concepto VARCHAR(150) NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    estado VARCHAR(20) DEFAULT 'PENDIENTE' CHECK (estado IN ('PENDIENTE', 'PARCIAL', 'PAGADO', 'VENCIDO', 'CANCELADO')),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pagos (
    id SERIAL PRIMARY KEY,
    cuenta_id INT NOT NULL REFERENCES cuentas_por_cobrar(id),
    monto_pagado DECIMAL(10, 2) NOT NULL,
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metodo_pago VARCHAR(50) NOT NULL,
    referencia_transaccion VARCHAR(100)
);

-- 6. OPTIMIZACIÓN DE RENDIMIENTO (ÍNDICES)
-- ==================================================================================

CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_apellidos ON usuarios(apellidos);
CREATE INDEX idx_inscripciones_alumno ON inscripciones(alumno_id);
CREATE INDEX idx_inscripciones_horario ON inscripciones(horario_id);
CREATE INDEX idx_asistencia_inscripcion ON registros_asistencia(inscripcion_id);
CREATE INDEX idx_cuentas_alumno ON cuentas_por_cobrar(alumno_id);
CREATE INDEX idx_cuentas_estado_fecha ON cuentas_por_cobrar(estado, fecha_vencimiento);
-- Índice para buscar por ciudad
CREATE INDEX idx_direcciones_ciudad ON direcciones(ciudad);

-- 7. AUTOMATIZACIÓN (DISPARADORES / TRIGGERS)
-- ==================================================================================

CREATE OR REPLACE FUNCTION actualizar_columna_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trg_actualizar_usuarios BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE PROCEDURE actualizar_columna_timestamp();
CREATE TRIGGER trg_actualizar_cuentas BEFORE UPDATE ON cuentas_por_cobrar FOR EACH ROW EXECUTE PROCEDURE actualizar_columna_timestamp();
CREATE TRIGGER trg_actualizar_inscripciones BEFORE UPDATE ON inscripciones FOR EACH ROW EXECUTE PROCEDURE actualizar_columna_timestamp();