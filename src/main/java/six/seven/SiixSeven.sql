-- SISTEMA ACADEX - SCRIPT MAESTRO INTEGRADO
-- ACTUALIZACIÓN: DÍA 4 (CALIFICACIONES Y EVALUACIÓN DOCENTE)

-- ----------------------------------------------------------
-- 1. CONFIGURACIÓN INICIAL
-- ----------------------------------------------------------
CREATE
DATABASE IF NOT EXISTS acadex_db;
USE
acadex_db;
SET
FOREIGN_KEY_CHECKS = 0;
-- ----------------------------------------------------------
-- 2. MÓDULO DE CATÁLOGOS BASE
-- ----------------------------------------------------------
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

-- ----------------------------------------------------------
-- 3. MÓDULO DE PERSONAL Y ROLES
-- ----------------------------------------------------------
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

-- ----------------------------------------------------------
-- 4. ESTRUCTURA ACADÉMICA (GRUPOS Y ASIGNACIONES)
-- ----------------------------------------------------------
DROP TABLE IF EXISTS GRUPO;
CREATE TABLE GRUPO
(
    id_grupo     INT AUTO_INCREMENT PRIMARY KEY,
    nombre_grupo VARCHAR(20) NOT NULL,
    capacidad    INT DEFAULT 30,
    id_periodo   INT         NOT NULL,
    CONSTRAINT fk_grupo_periodo FOREIGN KEY (id_periodo) REFERENCES PERIODO (id_periodo)
);

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

DROP TABLE IF EXISTS GRUPO_ALUMNO;
CREATE TABLE GRUPO_ALUMNO
(
    id_grupo  INT NOT NULL,
    id_alumno INT NOT NULL,
    PRIMARY KEY (id_grupo, id_alumno),
    CONSTRAINT fk_lista_grupo FOREIGN KEY (id_grupo) REFERENCES GRUPO (id_grupo),
    CONSTRAINT fk_lista_alumno FOREIGN KEY (id_alumno) REFERENCES ALUMNO (id_alumno)
);

-- ----------------------------------------------------------
-- 5. MÓDULO DE CALIFICACIONES Y EVALUACIÓN (DÍA 4)
-- ----------------------------------------------------------

-- Calificaciones académicas (Docente -> Alumno)
DROP TABLE IF EXISTS CALIFICACION;
CREATE TABLE CALIFICACION
(
    id_calificacion INT AUTO_INCREMENT PRIMARY KEY,
    id_alumno       INT NOT NULL,
    id_asignacion   INT NOT NULL,
    parcial_1       DECIMAL(5, 2) DEFAULT 0,
    parcial_2       DECIMAL(5, 2) DEFAULT 0,
    parcial_3       DECIMAL(5, 2) DEFAULT 0,
    nota_final      DECIMAL(5, 2) DEFAULT 0,
    observaciones   TEXT,
    fecha_registro  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_calif_alumno FOREIGN KEY (id_alumno) REFERENCES ALUMNO (id_alumno),
    CONSTRAINT fk_calif_asig FOREIGN KEY (id_asignacion) REFERENCES ASIGNACION_DOCENTE (id_asignacion)
);

-- Evaluación docente (Alumno -> Docente / CU-19)
DROP TABLE IF EXISTS EVALUACION_DOCENTE;
CREATE TABLE EVALUACION_DOCENTE
(
    id_evaluacion_doc INT AUTO_INCREMENT PRIMARY KEY,
    id_alumno         INT NOT NULL,
    id_docente        INT NOT NULL,
    id_periodo        INT NOT NULL,
    puntaje_total     INT NOT NULL,
    comentarios       TEXT,
    fecha_realizada   DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_evdoc_alumno FOREIGN KEY (id_alumno) REFERENCES ALUMNO (id_alumno),
    CONSTRAINT fk_evdoc_docente FOREIGN KEY (id_docente) REFERENCES DOCENTE (id_docente),
    CONSTRAINT fk_evdoc_periodo FOREIGN KEY (id_periodo) REFERENCES PERIODO (id_periodo)
);

-- ----------------------------------------------------------
-- 6. CONTROL, AUDITORÍA Y LOGS
-- ----------------------------------------------------------
DROP TABLE IF EXISTS CONTROL_EVALUACION;
CREATE TABLE CONTROL_EVALUACION
(
    id_control                 INT AUTO_INCREMENT PRIMARY KEY,
    fecha_apertura             DATETIME    NOT NULL,
    fecha_cierre               DATETIME    NOT NULL,
    estado                     VARCHAR(20) NOT NULL, -- 'ABIERTO', 'CERRADO'
    id_periodo                 INT         NOT NULL,
    id_coordinador_responsable INT,
    CONSTRAINT fk_control_periodo FOREIGN KEY (id_periodo) REFERENCES PERIODO (id_periodo) ON DELETE RESTRICT,
    CONSTRAINT fk_control_coord FOREIGN KEY (id_coordinador_responsable) REFERENCES COORDINADOR (id_coordinador)
);

DROP TABLE IF EXISTS LOG_SISTEMA;
CREATE TABLE LOG_SISTEMA
(
    id_log         INT AUTO_INCREMENT PRIMARY KEY,
    accion         VARCHAR(255) NOT NULL,
    fecha_hora     DATETIME     NOT NULL,
    id_coordinador INT          NOT NULL,
    CONSTRAINT fk_log_coordinador FOREIGN KEY (id_coordinador) REFERENCES COORDINADOR (id_coordinador) ON DELETE RESTRICT
);

-- ----------------------------------------------------------
-- 7. DISPARADORES (TRIGGERS) DE SEGURIDAD Y LÓGICA
-- ----------------------------------------------------------
DELIMITER
//

-- Validación de fechas de evaluación
DROP TRIGGER IF EXISTS trg_validar_fechas_apertura //
CREATE TRIGGER trg_validar_fechas_apertura
    BEFORE INSERT
    ON CONTROL_EVALUACION
    FOR EACH ROW
BEGIN
    IF NEW.fecha_cierre <= NEW.fecha_apertura THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: La fecha de cierre debe ser posterior a la de apertura.';
END IF;
END;
//

-- Cálculo automático de nota final (Día 4)
DROP TRIGGER IF EXISTS trg_calcular_nota_final //
CREATE TRIGGER trg_calcular_nota_final
    BEFORE INSERT
    ON CALIFICACION
    FOR EACH ROW
BEGIN
    SET NEW.nota_final = (NEW.parcial_1 + NEW.parcial_2 + NEW.parcial_3) / 3;
END;
//

-- Auditoría de cambios de estado (CU-19)
DROP TRIGGER IF EXISTS trg_log_cambio_estado_evaluacion //
CREATE TRIGGER trg_log_cambio_estado_evaluacion
    AFTER UPDATE
    ON CONTROL_EVALUACION
    FOR EACH ROW
BEGIN
    IF OLD.estado <> NEW.estado THEN
        INSERT INTO LOG_SISTEMA (accion, fecha_hora, id_coordinador)
        VALUES (CONCAT('Cambio estado evaluación: ', NEW.estado), NOW(), NEW.id_coordinador_responsable);
END IF;
END;
//

-- Validaciones de inserción (Auditoría)
DROP TRIGGER IF EXISTS trg_validar_alumno_insert //
CREATE TRIGGER trg_validar_alumno_insert
    BEFORE INSERT
    ON ALUMNO
    FOR EACH ROW
BEGIN
    IF LENGTH(NEW.matricula) < 8 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Matrícula inválida (mínimo 8 caracteres).';
END IF;
END;
//

DROP TRIGGER IF EXISTS trg_validar_docente_insert //
CREATE TRIGGER trg_validar_docente_insert
    BEFORE INSERT
    ON DOCENTE
    FOR EACH ROW
BEGIN
    IF LENGTH(NEW.rfc) < 12 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: RFC inválido.';
END IF;
END;
//

DELIMITER ;

-- ----------------------------------------------------------
-- 8. POBLACIÓN INICIAL Y DATOS DE PRUEBA
-- ----------------------------------------------------------
INSERT
IGNORE INTO ROL (nombre_rol) VALUES ('ADMIN'), ('ALUMNO'), ('DOCENTE');
INSERT
IGNORE INTO PERIODO (nombre_ciclo) VALUES ('Ago-Dic 2026');
INSERT
IGNORE INTO COORDINADOR (nombre, usuario) VALUES ('Fausto Avila', 'favila.admin');

-- Datos de ejemplo Alumno, Docente, Materia
INSERT
IGNORE INTO ALUMNO (matricula, nombre, correo, telefono, username, carrera, semestre)
VALUES ('21330001', 'Gael Eduardo Pacheco López', 'l21330001@losmochis.tecnm.mx', '6681234567', 'gael.pacheco', 'Ingeniería Informática', 6);

INSERT
IGNORE INTO DOCENTE (rfc, nombre, correo, telefono, username, departamento)
VALUES ('HEPR800101XYZ', 'Ricardo Hernández', 'rhernandez@losmochis.tecnm.mx', '6689876543', 'ricardo.hndz', 'Sistemas y Computación');

INSERT
IGNORE INTO MATERIA (nombre, clave, creditos, horas_teoricas, horas_practicas)
VALUES ('Administración de Base de Datos', 'SCD-1011', 5, 2, 3);