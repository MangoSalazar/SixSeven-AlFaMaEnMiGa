-- ==========================================================
-- SISTEMA ACADEX - SCRIPT MAESTRO INTEGRADO
-- ACTUALIZACIÓN FINAL: DÍA 5 (VISTAS DE HORARIO Y KARDEX)
-- ==========================================================

-- ----------------------------------------------------------
-- 1. CONFIGURACIÓN INICIAL
-- ----------------------------------------------------------
CREATE
DATABASE IF NOT EXISTS acadex_db;
USE
acadex_db;
SET
FOREIGN_KEY_CHECKS = 0; -- Desactiva revisiones para permitir DROP e inserts masivos

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
    nombre_rol VARCHAR(20) NOT NULL UNIQUE
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
-- 4. ESTRUCTURA ACADÉMICA (CON SOPORTE DE HORARIOS - DÍA 5)
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
    id_grupo      INT         NOT NULL,
    id_materia    INT         NOT NULL,
    id_docente    INT         NOT NULL,
    dias          VARCHAR(50) NOT NULL, -- Ej: 'LUN-MIE-VIE'
    hora_inicio   TIME        NOT NULL, -- Ej: '14:00:00'
    hora_fin      TIME        NOT NULL, -- Ej: '15:00:00'
    aula          VARCHAR(50) NOT NULL, -- Blindado a 50 caracteres para evitar Error 1406
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
-- 5. MÓDULO DE CALIFICACIONES Y EVALUACIÓN
-- ----------------------------------------------------------
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
    estado                     VARCHAR(20) NOT NULL,
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
-- 7. VISTAS REQUERIDAS (NUEVAS DÍA 5)
-- ----------------------------------------------------------
DROP VIEW IF EXISTS vw_horario_alumno;
CREATE VIEW vw_horario_alumno AS
SELECT GA.id_alumno,
       A.matricula,
       A.nombre       AS nombre_alumno,
       M.clave        AS clave_materia,
       M.nombre       AS nombre_materia,
       G.nombre_grupo AS grupo,
       D.nombre       AS nombre_docente,
       AD.dias,
       AD.hora_inicio,
       AD.hora_fin,
       AD.aula,
       P.nombre_ciclo AS periodo
FROM GRUPO_ALUMNO GA
         JOIN ALUMNO A ON GA.id_alumno = A.id_alumno
         JOIN GRUPO G ON GA.id_grupo = G.id_grupo
         JOIN PERIODO P ON G.id_periodo = P.id_periodo
         JOIN ASIGNACION_DOCENTE AD ON G.id_grupo = AD.id_grupo
         JOIN MATERIA M ON AD.id_materia = M.id_materia
         JOIN DOCENTE D ON AD.id_docente = D.id_docente;

DROP VIEW IF EXISTS vw_kardex_alumno;
CREATE VIEW vw_kardex_alumno AS
SELECT C.id_alumno,
       A.matricula,
       A.nombre       AS nombre_alumno,
       M.clave        AS clave_materia,
       M.nombre       AS nombre_materia,
       M.creditos,
       C.nota_final,
       CASE
           WHEN C.nota_final >= 70 THEN 'ACREDITADA'
           ELSE 'NO ACREDITADA'
           END        AS estatus_materia,
       P.nombre_ciclo AS periodo
FROM CALIFICACION C
         JOIN ALUMNO A ON C.id_alumno = A.id_alumno
         JOIN ASIGNACION_DOCENTE AD ON C.id_asignacion = AD.id_asignacion
         JOIN MATERIA M ON AD.id_materia = M.id_materia
         JOIN GRUPO G ON AD.id_grupo = G.id_grupo
         JOIN PERIODO P ON G.id_periodo = P.id_periodo;

-- ----------------------------------------------------------
-- 8. DISPARADORES (TRIGGERS)
-- ----------------------------------------------------------
DELIMITER
//

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

DROP TRIGGER IF EXISTS trg_calcular_nota_final //
CREATE TRIGGER trg_calcular_nota_final
    BEFORE INSERT
    ON CALIFICACION
    FOR EACH ROW
BEGIN
    SET NEW.nota_final = (NEW.parcial_1 + NEW.parcial_2 + NEW.parcial_3) / 3;
END;
//

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
-- 9. POBLACIÓN INICIAL Y DATOS DE PRUEBA (DÍA 5)
-- ----------------------------------------------------------
INSERT
IGNORE INTO ROL (nombre_rol) VALUES ('ADMIN'), ('ALUMNO'), ('DOCENTE');
INSERT
IGNORE INTO PERIODO (nombre_ciclo) VALUES ('Ago-Dic 2026');
INSERT
IGNORE INTO COORDINADOR (nombre, usuario) VALUES ('Fausto Avila', 'favila.admin');

INSERT
IGNORE INTO ALUMNO (id_alumno, matricula, nombre, correo, telefono, username, carrera, semestre)
VALUES (1, '21330001', 'Gael Eduardo Pacheco López', 'l21330001@losmochis.tecnm.mx', '6681234567', 'gael.pacheco', 'Ingeniería Informática', 6);

INSERT
IGNORE INTO DOCENTE (id_docente, rfc, nombre, correo, telefono, username, departamento)
VALUES (1, 'HEPR800101XYZ', 'Ricardo Hernández', 'rhernandez@losmochis.tecnm.mx', '6689876543', 'ricardo.hndz', 'Sistemas y Computación');

INSERT
IGNORE INTO MATERIA (id_materia, nombre, clave, creditos, horas_teoricas, horas_practicas)
VALUES (1, 'Administración de Base de Datos', 'SCD-1011', 5, 2, 3);

INSERT
IGNORE INTO GRUPO (id_grupo, nombre_grupo, capacidad, id_periodo)
VALUES (1, '601', 35, 1);

-- Vinculamos al alumno al grupo en las listas oficiales
INSERT
IGNORE INTO GRUPO_ALUMNO (id_grupo, id_alumno) VALUES (1, 1);

-- Asignación docente corregida (Usa id_docente = 1 que pertenece a Ricardo)
INSERT
IGNORE INTO ASIGNACION_DOCENTE (id_asignacion, id_grupo, id_materia, id_docente, dias, hora_inicio, hora_fin, aula)
VALUES (1, 1, 1, 1, 'LUN-MIE-VIE', '14:00:00', '15:00:00', 'Lab-Sistemas');

-- Inserción en calificaciones para generar el Kardex automático
INSERT
IGNORE INTO CALIFICACION (id_alumno, id_asignacion, parcial_1, parcial_2, parcial_3, observaciones)
VALUES (1, 1, 90, 85, 95, 'Excelente desempeño general');

SET
FOREIGN_KEY_CHECKS = 1; -- Reactiva la integridad referencial al finalizar