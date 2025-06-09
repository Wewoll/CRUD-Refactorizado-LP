<?php
/**
*    File        : backend/models/teachersSubjects.php
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Junio 2025
*    Status      : Prototype
*    Iteration   : 1.0
*/

function assignSubjectToTeacher($conn, $teacher_id, $subject_id) {
    try {
        $sql = "INSERT INTO teachers_subjects (teacher_id, subject_id) VALUES (?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ii", $teacher_id, $subject_id);
        $stmt->execute();
        $inserted = $stmt->affected_rows;
        $id = $conn->insert_id;
        $stmt->close();

        return [
            'inserted' => $inserted,
            'id' => $id
        ];

    } catch (mysqli_sql_exception $e) {
        return [
            'inserted' => 0,
            'error_code' => $e->getCode(),
            'error' => $e->getMessage()
        ];
    }
}

function getAllTeachersSubjects($conn) {
    $sql = "SELECT teachers_subjects.id,
                   teachers_subjects.teacher_id,
                   teachers_subjects.subject_id,
                   teachers.fullname AS teacher_fullname,
                   subjects.name AS subject_name
            FROM teachers_subjects
            JOIN subjects ON teachers_subjects.subject_id = subjects.id
            JOIN teachers ON teachers_subjects.teacher_id = teachers.id";

    return $conn->query($sql)->fetch_all(MYSQLI_ASSOC);
}

function getSubjectsByTeacher($conn, $teacher_id) {
    $sql = "SELECT ts.subject_id, s.name
            FROM teachers_subjects ts
            JOIN subjects s ON ts.subject_id = s.id
            WHERE ts.teacher_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $teacher_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();

    return $result->fetch_all(MYSQLI_ASSOC); 
}

function updateTeacherSubject($conn, $id, $teacher_id, $subject_id) {
    try {
        $sql = "UPDATE teachers_subjects 
                SET teacher_id = ?, subject_id = ? 
                WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("iii", $teacher_id, $subject_id, $id);
        $stmt->execute();
        $updated = $stmt->affected_rows;
        $stmt->close();

        return ['updated' => $updated];

    } catch (mysqli_sql_exception $e) {
        return [
            'updated' => 0,
            'error_code' => $e->getCode(),
            'error' => $e->getMessage()
        ];
    }
}

function removeTeacherSubject($conn, $id) {
    try {
        $sql = "DELETE FROM teachers_subjects WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $deleted = $stmt->affected_rows;
        $stmt->close();

        return ['deleted' => $deleted];

    } catch (mysqli_sql_exception $e) {
        return [
            'deleted' => 0,
            'error_code' => $e->getCode(),
            'error' => $e->getMessage()
        ];
    }
}

// Esta función compara por email (puedes ajustar si usas otro identificador)
function isTeacherAlsoStudent($conn, $teacher_id, $subject_id) {
    // Obtener email del profesor
    $stmt = $conn->prepare("SELECT email FROM teachers WHERE id = ?");
    $stmt->bind_param("i", $teacher_id);
    $stmt->execute();
    $stmt->bind_result($email);
    $stmt->fetch();
    $stmt->close();

    // Buscar si existe un estudiante con ese email en esa materia
    $stmt2 = $conn->prepare(
        "SELECT ss.id FROM students s
         JOIN students_subjects ss ON s.id = ss.student_id
         WHERE s.email = ? AND ss.subject_id = ?"
    );
    $stmt2->bind_param("si", $email, $subject_id);
    $stmt2->execute();
    $stmt2->store_result();
    $exists = $stmt2->num_rows > 0;
    $stmt2->close();

    return $exists;
}
?>