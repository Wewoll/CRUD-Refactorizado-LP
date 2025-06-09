<?php
/**
*    File        : backend/controllers/studentsSubjectsController.php
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*    Iteration   : 3.0 ( prototype )
*/

require_once("./models/studentsSubjects.php");
require_once __DIR__ . '/../helpers/utils.php';

function handleGet($conn) {
    $studentsSubjects = getAllSubjectsStudents($conn);
    echo json_encode($studentsSubjects);
}

function validarDatosRelacion($student_id, $subject_id) {
    if (empty($student_id) || empty($subject_id)) {
        sendError(400, "Debe seleccionar un estudiante y una materia.");
        return false;
    }
    // Verificar si el estudiante ya está como profesor en esa materia
    if (isStudentAlsoTeacher($conn, $student_id, $subject_id)) {
        sendError(400, "No se puede inscribir como estudiante en una materia donde ya está asignado como profesor.");
        return false;
    }
    return true;
}

function handlePost($conn) {
    $input = json_decode(file_get_contents("php://input"), true);

    $student_id = $input['student_id'] ?? '';
    $subject_id = $input['subject_id'] ?? '';

    if (!validarDatosRelacion($conn, $student_id, $subject_id)) return;

    $result = assignSubjectToStudent($conn, $student_id, $subject_id, $input['approved']);

    if ($result['inserted'] > 0) {
        sendSuccess("Relacion agregada correctamente.");
    } else if (($result['error_code'] ?? null) == 1062) {
        sendError(400, "La relación entre el estudiante y la materia ya existe.");
    } else {
        sendError(500, "Ocurrió un error inesperado al agregar la relación.");
    }
}

function handlePut($conn) {
    $input = json_decode(file_get_contents("php://input"), true);

    if (!isset($input['id'], $input['student_id'], $input['subject_id'], $input['approved'])) {
        sendError(400, "Datos incompletos.");
        return;
    }

    if (!validarDatosRelacion($conn, $input['student_id'], $input['subject_id'])) return;

    $result = updateStudentSubject($conn, $input['id'], $input['student_id'], $input['subject_id'], $input['approved']);

    if (($result['updated'] ?? 0) > 0) {
        sendSuccess("Relación actualizada correctamente.");
    } else if (($result['error_code'] ?? null) == 1062) {
        sendError(400, "Ya existe una relación con ese estudiante y materia.");
    } else {
        sendError(500, "Ocurrio un error inesperado al editar la relación.");
    }
}

function handleDelete($conn) {
    $input = json_decode(file_get_contents("php://input"), true);

    $result = removeStudentSubject($conn, $input['id']);

    if (($result['deleted'] ?? 0) > 0) {
        sendSuccess("Relación eliminada correctamente.");
    } else if (($result['error_code'] ?? null) == 1451) {
        sendError(400, "No se puede eliminar la relación porque está referenciada en otra tabla.");
    } else {
        sendError(500, "Ocurrio un error inesperado al borrar la relación.");
    }
}
?>
