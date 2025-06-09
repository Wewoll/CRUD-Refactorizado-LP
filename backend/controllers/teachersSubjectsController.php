<?php
/**
*    File        : backend/controllers/teachersSubjectsController.php
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Junio 2025
*    Status      : Prototype
*    Iteration   : 1.0
*/

require_once("./models/teachersSubjects.php");
require_once __DIR__ . '/../helpers/utils.php';

function handleGet($conn) {
    $teachersSubjects = getAllTeachersSubjects($conn);
    echo json_encode($teachersSubjects);
}

function validarRelacionProfesor($conn, $teacher_id, $subject_id) {
    if (empty($teacher_id) || empty($subject_id)) {
        sendError(400, "Debe seleccionar un profesor y una materia.");
        return false;
    }
    // Verificar si el profesor ya está como estudiante en esa materia
    if (isTeacherAlsoStudent($conn, $teacher_id, $subject_id)) {
        sendError(400, "No se puede asignar como profesor a una materia donde ya está inscripto como estudiante.");
        return false;
    }
    return true;
}

function handlePost($conn) {
    $input = json_decode(file_get_contents("php://input"), true);

    $teacher_id = $input['teacher_id'] ?? '';
    $subject_id = $input['subject_id'] ?? '';

    if (!validarRelacionProfesor($conn, $teacher_id, $subject_id)) return;

    $result = assignSubjectToTeacher($conn, $teacher_id, $subject_id);

    if ($result['inserted'] > 0) {
        sendSuccess("Asignación agregada correctamente.");
    } else if (($result['error_code'] ?? null) == 1062) {
        sendError(400, "La relación entre el profesor y la materia ya existe.");
    } else {
        sendError(500, "Ocurrió un error inesperado al agregar la relación.");
    }
}

function handlePut($conn) {
    $input = json_decode(file_get_contents("php://input"), true);

    if (!isset($input['id'], $input['teacher_id'], $input['subject_id'])) {
        sendError(400, "Datos incompletos.");
        return;
    }

    if (!validarRelacionProfesor($conn, $input['teacher_id'], $input['subject_id'])) return;

    $result = updateTeacherSubject($conn, $input['id'], $input['teacher_id'], $input['subject_id']);

    if (($result['updated'] ?? 0) > 0) {
        sendSuccess("Asignación actualizada correctamente.");
    } else if (($result['error_code'] ?? null) == 1062) {
        sendError(400, "Ya existe una relación con ese profesor y materia.");
    } else {
        sendError(500, "Ocurrió un error inesperado al editar la relación.");
    }
}

function handleDelete($conn) {
    $input = json_decode(file_get_contents("php://input"), true);

    $result = removeTeacherSubject($conn, $input['id']);

    if (($result['deleted'] ?? 0) > 0) {
        sendSuccess("Asignación eliminada correctamente.");
    } else if (($result['error_code'] ?? null) == 1451) {
        sendError(400, "No se puede eliminar la relación porque está referenciada en otra tabla.");
    } else {
        sendError(500, "Ocurrió un error inesperado al borrar la relación.");
    }
}
?>