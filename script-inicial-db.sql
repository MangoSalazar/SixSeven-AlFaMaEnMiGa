-- 1. CONFIGURACIÓN INICIAL
CREATE DATABASE IF NOT EXISTS acadex_db;
USE acadex_db;

-- 2. MÓDULO DE CATÁLOGOS BASE
CREATE TABLE IF NOT EXISTS MATERIA (
                                       id_materia INT AUTO_INCREMENT PRIMARY KEY,
                                       nombre VARCHAR(100) NOT NULL,
    clave VARCHAR(15) UNIQUE NOT NULL
    );

CREATE TABLE IF NOT EXISTS ACADEMIA (
                                        id_academia INT AUTO_INCREMENT PRIMARY KEY,
                                        nombre_academia VARCHAR(50) NOT NULL
    );

CREATE TABLE IF NOT EXISTS PERIODO (
                                       id_periodo INT AUTO_INCREMENT PRIMARY KEY,
                                       nombre_ciclo VARCHAR(50) NOT NULL
    );

-- 3. MÓDULO DE PERSONAL Y CONFIGURACIÓN
CREATE TABLE IF NOT EXISTS COORDINADOR (
                                           id_coordinador INT AUTO_INCREMENT PRIMARY KEY,
                                           nombre VARCHAR(100) NOT NULL,
    usuario VARCHAR(50) UNIQUE NOT NULL
    );

CREATE TABLE IF NOT EXISTS ROL (
                                   id_rol INT AUTO_INCREMENT PRIMARY KEY,
                                   nombre_rol VARCHAR(20) NOT NULL UNIQUE -- 'ADMIN', 'ALUMNO', 'DOCENTE'
    );

CREATE TABLE IF NOT EXISTS USUARIO (
                                       id_usuario INT AUTO_INCREMENT PRIMARY KEY,
                                       username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    id_rol INT NOT NULL,
    id_referencia INT NOT NULL,
    CONSTRAINT fk_usuario_rol FOREIGN KEY (id_rol) REFERENCES ROL(id_rol)
    );

-- 4. CONTROL Y AUDITORÍA
CREATE TABLE IF NOT EXISTS CONTROL_EVALUACION (
                                                  id_control INT AUTO_INCREMENT PRIMARY KEY,
                                                  fecha_apertura DATETIME NOT NULL,
                                                  fecha_cierre DATETIME NOT NULL,
                                                  estado VARCHAR(20) NOT NULL,
    id_periodo INT NOT NULL,
    CONSTRAINT fk_control_periodo FOREIGN KEY (id_periodo)
    REFERENCES PERIODO(id_periodo) ON DELETE RESTRICT
    );

CREATE TABLE IF NOT EXISTS LOG_SISTEMA (
                                           id_log INT AUTO_INCREMENT PRIMARY KEY,
                                           accion VARCHAR(255) NOT NULL,
    fecha_hora DATETIME NOT NULL,
    id_coordinador INT NOT NULL,
    CONSTRAINT fk_log_coordinador FOREIGN KEY (id_coordinador)
    REFERENCES COORDINADOR(id_coordinador) ON DELETE RESTRICT
    );

CREATE TABLE IF NOT EXISTS EVALUACION (
                                          id_evaluacion INT AUTO_INCREMENT PRIMARY KEY,
                                          puntaje_obtenido INT NOT NULL,
                                          id_docente INT NOT NULL
);

-- 5. TRIGGER DE SEGURIDAD
DELIMITER //
CREATE TRIGGER trg_validar_fechas_apertura
    BEFORE INSERT ON CONTROL_EVALUACION
    FOR EACH ROW
BEGIN
    IF NEW.fecha_cierre <= NEW.fecha_apertura THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: La fecha de cierre debe ser posterior a la de apertura.';
END IF;
END; //
DELIMITER ;

-- 6. DATOS DE PRUEBA INICIALES (Día 1)
INSERT IGNORE INTO ROL (nombre_rol) VALUES ('ADMIN'), ('ALUMNO'), ('DOCENTE');
INSERT IGNORE INTO PERIODO (nombre_ciclo) VALUES ('Ago-Dic 2026');
INSERT IGNORE INTO USUARIO (username, password, id_rol, id_referencia)
VALUES ('gael.estudiante', '12345', 2, 1);