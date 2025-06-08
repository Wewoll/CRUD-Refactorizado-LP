<?php
/**
*    File        : backend/controllers/subjectsController.php
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*    Iteration   : 3.0 ( prototype )
*/

require_once("./models/subjects.php");
require_once __DIR__ . '/../helpers/utils.php';

function handleGet($conn) {
    $input = json_decode(file_get_contents("php://input"), true);

    if (isset($input['id'])) {
        $subject = getSubjectById($conn, $input['id']);
        echo json_encode($subject);
    } else {
        $subjects = getAllSubjects($conn);
        echo json_encode($subjects);
    }
}

function handlePost($conn) 
{
    $input = json_decode(file_get_contents("php://input"), true);

    $result = createSubject($conn, $input['name']);

    if ($result['inserted'] > 0) {
        sendSuccess("Materia agregada correctamente.");
    } else if (($result['error_code'] ?? null) == 1062) {
        sendError(400, "El nombre de la materia ya está registrado.");
    } else {
        sendError(400, "Ocurrió un error inesperado al agregar la materia.");
    }
}

function handlePut($conn) {
    $input = json_decode(file_get_contents("php://input"), true);

    $result = updateSubject($conn, $input['id'], $input['name']);

    if ($result['updated'] > 0) {
        sendSuccess("Materia actualizada correctamente.");
    } else if (($result['error_code'] ?? null) == 1062) {
        sendError(400, "El nombre de la materia ya está registrado.");
    } else {
        sendError(400, "Ocurrió un error inesperado al editar la materia.");
    }
}

function handleDelete($conn) {
    $input = json_decode(file_get_contents("php://input"), true);

    $result = deleteSubject($conn, $input['id']);

    if (($result['deleted'] ?? 0) > 0) {
        sendSuccess("Materia eliminada correctamente.");
    } else if (($result['error_code'] ?? null) == 1451) {
        sendError(400, "No se puede borrar la materia porque está asignada a uno o más estudiantes.");
    } else {
        sendError(400, "Ocurrió un error inesperado al borrar la materia.");
    }
}
?>