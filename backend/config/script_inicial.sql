-- =========================
-- Crear base de datos y usuario (ejecutar como root)
-- =========================

CREATE DATABASE academic_db CHARACTER SET utf8 COLLATE utf8_unicode_ci;

CREATE USER 'academic_user'@'localhost' IDENTIFIED BY '12345';

GRANT ALL PRIVILEGES ON academic_db.* TO 'academic_user'@'localhost';
FLUSH PRIVILEGES;

USE academic_db;

-- =========================
-- Tabla students
-- =========================

CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    age INT NOT NULL
) ENGINE=INNODB;

INSERT INTO students (fullname, email, age) VALUES
('Ana García', 'ana@example.com', 21),
('Lucas Torres', 'lucas@example.com', 24),
('Marina Díaz', 'marina@example.com', 22);

-- =========================
-- Tabla teachers
-- =========================

CREATE TABLE teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    age INT NOT NULL
) ENGINE=INNODB;

INSERT INTO teachers (fullname, email, age) VALUES
('Carlos Pérez', 'carlos.perez@uni.edu', 45),
('Sofía López', 'sofia.lopez@uni.edu', 38),
('Martín Ruiz', 'martin.ruiz@uni.edu', 50),
("Gabriel Gonzales Ferreira", "gaby@uni.edu", 45);

-- =========================
-- Tabla subjects
-- =========================

CREATE TABLE subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
) ENGINE=INNODB;

INSERT INTO subjects (name) VALUES 
('Tecnologías A'), 
('Tecnologías B'), 
('Algoritmos y Estructura de Datos I'), 
('Fundamentos de Informática');

-- =========================
-- Tabla students_subjects
-- =========================

CREATE TABLE students_subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    approved BOOLEAN DEFAULT FALSE,
    UNIQUE (student_id, subject_id),
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
) ENGINE=INNODB;

INSERT INTO students_subjects (student_id, subject_id, approved) VALUES
(1, 1, 1),
(2, 2, 0),
(3, 3, 1);

-- =========================
-- Tabla teachers_subjects
-- =========================

CREATE TABLE teachers_subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id INT NOT NULL,
    subject_id INT NOT NULL,
    UNIQUE (teacher_id, subject_id),
    FOREIGN KEY (teacher_id) REFERENCES teachers(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
) ENGINE=INNODB;

INSERT INTO teachers_subjects (teacher_id, subject_id) VALUES
(1, 1),
(1, 2),
(2, 3),
(3, 4),
(4, 2);

-- =========================
-- Fin del script
-- =========================