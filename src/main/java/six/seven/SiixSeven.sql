-- 1. CONFIGURACIÓN INICIAL
CREATE
DATABASE IF NOT EXISTS acadex_db;
USE
acadex_db;

-- Limpieza de triggers previos para evitar errores
DROP TRIGGER IF EXISTS trg_validar_fechas_apertura;

-- 2. MÓDULO DE CATÁLOGOS BASE (Actualizados Día 2)
DROP TABLE IF EXISTS MATERIA;
CREATE TABLE MATERIA
(
    id_materia      INT AUTO_INCREMENT PRIMARY KEY,
    nombre          VARCHAR(100)       NOT NULL,
    clave           VARCHAR(15) UNIQUE NOT NULL,
    creditos        INT DEFAULT 5,
    horas_teoricas  INT DEFAULT 0,
    horas_practicas INT DEFAULT 0
);

DROP TABLE IF EXISTS ACADEMIA;
CREATE TABLE ACADEMIA
(
    id_academia     INT AUTO_INCREMENT PRIMARY KEY,
    nombre_academia VARCHAR(50) NOT NULL
);

DROP TABLE IF EXISTS PERIODO;
CREATE TABLE PERIODO
(
    id_periodo   INT AUTO_INCREMENT PRIMARY KEY,
    nombre_ciclo VARCHAR(50) NOT NULL
);

-- 3. MÓDULO DE PERSONAL Y ALTAS (Campos Aprobados WhatsApp)
DROP TABLE IF EXISTS ALUMNO;
CREATE TABLE ALUMNO
(
    id_alumno INT AUTO_INCREMENT PRIMARY KEY,
    matricula VARCHAR(20) UNIQUE  NOT NULL,
    nombre    VARCHAR(100)        NOT NULL,
    correo    VARCHAR(100) UNIQUE NOT NULL,
    telefono  VARCHAR(15),
    username  VARCHAR(50)         NOT NULL,
    carrera   VARCHAR(50),
    semestre  INT
);

DROP TABLE IF EXISTS DOCENTE;
CREATE TABLE DOCENTE
(
    id_docente   INT AUTO_INCREMENT PRIMARY KEY,
    rfc          VARCHAR(13) UNIQUE  NOT NULL,
    nombre       VARCHAR(100)        NOT NULL,
    correo       VARCHAR(100) UNIQUE NOT NULL,
    telefono     VARCHAR(15),
    username     VARCHAR(50)         NOT NULL,
    departamento VARCHAR(50)
);

DROP TABLE IF EXISTS COORDINADOR;
CREATE TABLE COORDINADOR
(
    id_coordinador INT AUTO_INCREMENT PRIMARY KEY,
    nombre         VARCHAR(100)       NOT NULL,
    usuario        VARCHAR(50) UNIQUE NOT NULL
);

DROP TABLE IF EXISTS ROL;
CREATE TABLE ROL
(
    id_rol     INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol VARCHAR(20) NOT NULL UNIQUE -- 'ADMIN', 'ALUMNO', 'DOCENTE'
);

DROP TABLE IF EXISTS USUARIO;
CREATE TABLE USUARIO
(
    id_usuario    INT AUTO_INCREMENT PRIMARY KEY,
    username      VARCHAR(50)  NOT NULL UNIQUE,
    password      VARCHAR(255) NOT NULL,
    id_rol        INT          NOT NULL,
    id_referencia INT          NOT NULL,
    CONSTRAINT fk_usuario_rol FOREIGN KEY (id_rol) REFERENCES ROL (id_rol)
);

-- 4. CONTROL Y AUDITORÍA
DROP TABLE IF EXISTS CONTROL_EVALUACION;
CREATE TABLE CONTROL_EVALUACION
(
    id_control     INT AUTO_INCREMENT PRIMARY KEY,
    fecha_apertura DATETIME    NOT NULL,
    fecha_cierre   DATETIME    NOT NULL,
    estado         VARCHAR(20) NOT NULL,
    id_periodo     INT         NOT NULL,
    CONSTRAINT fk_control_periodo FOREIGN KEY (id_periodo)
        REFERENCES PERIODO (id_periodo) ON DELETE RESTRICT
);

DROP TABLE IF EXISTS LOG_SISTEMA;
CREATE TABLE LOG_SISTEMA
(
    id_log         INT AUTO_INCREMENT PRIMARY KEY,
    accion         VARCHAR(255) NOT NULL,
    fecha_hora     DATETIME     NOT NULL,
    id_coordinador INT          NOT NULL,
    CONSTRAINT fk_log_coordinador FOREIGN KEY (id_coordinador)
        REFERENCES COORDINADOR (id_coordinador) ON DELETE RESTRICT
);

DROP TABLE IF EXISTS EVALUACION;
CREATE TABLE EVALUACION
(
    id_evaluacion    INT AUTO_INCREMENT PRIMARY KEY,
    puntaje_obtenido INT NOT NULL,
    id_docente       INT NOT NULL
);

-- 5. TRIGGER DE SEGURIDAD
DELIMITER
//
CREATE TRIGGER trg_validar_fechas_apertura
    BEFORE INSERT
    ON CONTROL_EVALUACION
    FOR EACH ROW
BEGIN
    IF NEW.fecha_cierre <= NEW.fecha_apertura THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: La fecha de cierre debe ser posterior a la de apertura.';
END IF;
END;
//
DELIMITER ;

-- 6. DATOS DE PRUEBA (Día 2)
INSERT
IGNORE INTO ROL (nombre_rol) VALUES ('ADMIN'), ('ALUMNO'), ('DOCENTE');
INSERT
IGNORE INTO PERIODO (nombre_ciclo) VALUES ('Ago-Dic 2026');

-- Inserciones para validar el módulo de altas
INSERT INTO ALUMNO (matricula, nombre, correo, telefono, username, carrera, semestre)
VALUES ('21330001', 'Gael Eduardo Pacheco', 'l21330001@losmochis.tecnm.mx', '6681002030', 'gael.admin', 'Informatica',
        6);

INSERT INTO DOCENTE (rfc, nombre, correo, telefono, username, departamento)
VALUES ('HEPR800101XYZ', 'Ricardo Hernandez', 'rhernandez@losmochis.tecnm.mx', '6684005060', 'ricardo.doc', 'Sistemas');

INSERT INTO MATERIA (nombre, clave, creditos, horas_teoricas, horas_practicas)
VALUES ('Base de Datos', 'SCD-1011', 5, 2, 3);

INSERT
IGNORE INTO USUARIO (username, password, id_rol, id_referencia)
VALUES ('gael.estudiante', '12345', 2, 1);

-- Insertar un Alumno (Tú mismo)
INSERT INTO ALUMNO (matricula, nombre, correo, telefono, username, carrera, semestre)
VALUES ('21330001', 'Gael Eduardo Pacheco López', 'l21330001@losmochis.tecnm.mx', '6681234567', 'gael.pacheco',
        'Ingeniería Informática', 6);

-- Insertar un Docente (Usemos a Ricardo como ejemplo)
INSERT INTO DOCENTE (rfc, nombre, correo, telefono, username, departamento)
VALUES ('HEPR800101XYZ', 'Ricardo Hernández', 'rhernandez@losmochis.tecnm.mx', '6689876543', 'ricardo.hndz',
        'Sistemas y Computación');

-- Insertar una Materia (La que estás cursando ahorita)
INSERT INTO MATERIA (nombre, clave, creditos, horas_teoricas, horas_practicas)
VALUES ('Administración de Base de Datos', 'SCD-1011', 5, 2, 3);


-- 1. Verificamos la tabla de Alumnos
SELECT *
FROM ALUMNO;

-- 2. Verificamos la tabla de Docentes
SELECT *
FROM DOCENTE;

-- 3. Verificamos la tabla de Materias
SELECT *
FROM MATERIA;

-- MÓDULO DE GRUPOS Y ASIGNACIONES (Día 3)

-- 1. Tabla de Grupo: El contenedor principal
DROP TABLE IF EXISTS GRUPO;
CREATE TABLE GRUPO
(
    id_grupo     INT AUTO_INCREMENT PRIMARY KEY,
    nombre_grupo VARCHAR(20) NOT NULL, -- Ej: 'A', 'B', '101'
    capacidad    INT DEFAULT 30,
    id_periodo   INT         NOT NULL,
    CONSTRAINT fk_grupo_periodo FOREIGN KEY (id_periodo)
        REFERENCES PERIODO (id_periodo)
);

-- 2. Relación Grupo - Materia - Docente (La "Carga Académica")
-- Un grupo tiene una materia específica y un titular responsable.
DROP TABLE IF EXISTS ASIGNACION_DOCENTE;
CREATE TABLE ASIGNACION_DOCENTE
(
    id_asignacion INT AUTO_INCREMENT PRIMARY KEY,
    id_grupo      INT NOT NULL,
    id_materia    INT NOT NULL,
    id_docente    INT NOT NULL,
    CONSTRAINT fk_asig_grupo FOREIGN KEY (id_grupo) REFERENCES GRUPO (id_grupo),
    CONSTRAINT fk_asig_materia FOREIGN KEY (id_materia) REFERENCES MATERIA (id_materia),
    CONSTRAINT fk_asig_docente FOREIGN KEY (id_docente) REFERENCES DOCENTE (id_docente)
);

-- 3. Relación Grupo - Alumno (La "Lista de Clase")
-- Muchos alumnos pertenecen a muchos grupos.
DROP TABLE IF EXISTS GRUPO_ALUMNO;
CREATE TABLE GRUPO_ALUMNO
(
    id_grupo  INT NOT NULL,
    id_alumno INT NOT NULL,
    PRIMARY KEY (id_grupo, id_alumno),
    CONSTRAINT fk_lista_grupo FOREIGN KEY (id_grupo) REFERENCES GRUPO (id_grupo),
    CONSTRAINT fk_lista_alumno FOREIGN KEY (id_alumno) REFERENCES ALUMNO (id_alumno)
);

-- TRIGGERS DE VALIDACIÓN DE DATOS

-- 1. Limpieza de triggers para evitar errores de duplicados
DROP TRIGGER IF EXISTS trg_validar_alumno_insert;
DROP TRIGGER IF EXISTS trg_validar_docente_insert;
DROP TRIGGER IF EXISTS trg_validar_materia_insert;
DROP TRIGGER IF EXISTS trg_validar_usuario_insert;

DELIMITER //

-- 2. Validación para ALUMNO (Ajustado a tus columnas reales)
CREATE TRIGGER trg_validar_alumno_insert
    BEFORE INSERT ON ALUMNO
    FOR EACH ROW
BEGIN
    -- Validamos que el número de control tenga al menos 8 dígitos
    IF LENGTH(NEW.numero_control) < 8 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: El número de control debe tener al menos 8 caracteres.';
END IF;

-- Nota: Quitamos la validación de correo porque no existe en esta tabla
END; //

-- 3. Validación para DOCENTE (Asegúrate que estas columnas sí existan en Docente)
CREATE TRIGGER trg_validar_docente_insert
    BEFORE INSERT ON DOCENTE
    FOR EACH ROW
BEGIN
    -- Si en docente sí tienes RFC, esta línea se queda:
    IF LENGTH(NEW.rfc) < 12 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: El RFC debe tener entre 12 y 13 caracteres.';
END IF;
END; //

-- 4. Validación para MATERIA
CREATE TRIGGER trg_validar_materia_insert
    BEFORE INSERT ON MATERIA
    FOR EACH ROW
BEGIN
    IF NEW.creditos <= 0 OR NEW.horas_teoricas < 0 OR NEW.horas_practicas < 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: Los créditos y horas deben ser valores positivos.';
END IF;
END; //

-- 5. Validación para USUARIO
CREATE TRIGGER trg_validar_usuario_insert
    BEFORE INSERT ON USUARIO
    FOR EACH ROW
BEGIN
    IF LENGTH(NEW.password) < 5 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: La contraseña es demasiado corta (mínimo 5 caracteres).';
END IF;
END; //

DELIMITER ;