<?php
/**
*    File        : backend/models/studentsSubjects.php
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*    Iteration   : 3.0 ( prototype )
*/

function assignSubjectToStudent($conn, $student_id, $subject_id, $approved) {
    try {
        $sql = "INSERT INTO students_subjects (student_id, subject_id, approved) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("iii", $student_id, $subject_id, $approved);
        $stmt->execute();
        $inserted = $stmt->affected_rows;
        $id = $conn->insert_id;
        $stmt->close();

        return [
            'inserted' => $stmt->affected_rows,
            'id' => $conn->insert_id
        ];

    } catch (mysqli_sql_exception $e) {
        return [
            'inserted' => 0,
            'error_code' => $e->getCode(),
            'error' => $e->getMessage()
        ];
    }
}

//Query escrita sin ALIAS resumidos (a mi me gusta más):
function getAllSubjectsStudents($conn) {
    $sql = "SELECT students_subjects.id,
                students_subjects.student_id,
                students_subjects.subject_id,
                students_subjects.approved,
                students.fullname AS student_fullname,
                subjects.name AS subject_name
            FROM students_subjects
            JOIN subjects ON students_subjects.subject_id = subjects.id
            JOIN students ON students_subjects.student_id = students.id";

    return $conn->query($sql)->fetch_all(MYSQLI_ASSOC);
}

//Query escrita con ALIAS resumidos:
function getSubjectsByStudent($conn, $student_id) {
    $sql = "SELECT ss.subject_id, s.name, ss.approved
            FROM students_subjects ss
            JOIN subjects s ON ss.subject_id = s.id
            WHERE ss.student_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $student_id);
    $stmt->execute();
    $result= $stmt->get_result();
    $stmt->close();

    return $result->fetch_all(MYSQLI_ASSOC); 
}

function updateStudentSubject($conn, $id, $student_id, $subject_id, $approved) {
    try {
        $sql = "UPDATE students_subjects 
                SET student_id = ?, subject_id = ?, approved = ? 
                WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("iiii", $student_id, $subject_id, $approved, $id);
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

function removeStudentSubject($conn, $id) {
    try {
        $sql = "DELETE FROM students_subjects WHERE id = ?";
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

function isStudentAlsoTeacher($conn, $student_id, $subject_id) {
    // Obtener email del estudiante
    $stmt = $conn->prepare("SELECT email FROM students WHERE id = ?");
    $stmt->bind_param("i", $student_id);
    $stmt->execute();
    $stmt->bind_result($email);
    $stmt->fetch();
    $stmt->close();

    // Buscar si existe un profesor con ese email en esa materia
    $stmt2 = $conn->prepare(
        "SELECT ts.id FROM teachers t
         JOIN teachers_subjects ts ON t.id = ts.teacher_id
         WHERE t.email = ? AND ts.subject_id = ?"
    );
    $stmt2->bind_param("si", $email, $subject_id);
    $stmt2->execute();
    $stmt2->store_result();
    $exists = $stmt2->num_rows > 0;
    $stmt2->close();

    return $exists;
}
?>
