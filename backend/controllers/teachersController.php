<?php
/**
*    File        : backend/controllers/teachersController.php
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Junio 2025
*    Status      : Prototype
*    Iteration   : 1.0
*/

require_once("./models/teachers.php");
require_once __DIR__ . '/../helpers/utils.php';

function handleGet($conn) {
    $input = json_decode(file_get_contents("php://input"), true);

    if (isset($input['id'])) {
        $teacher = getTeacherById($conn, $input['id']);
        echo json_encode($teacher);
    } else {
        $teachers = getAllTeachers($conn);
        echo json_encode($teachers);
    }
}

function validarDatosProfesor($fullname, $email, $age) {
    if (trim($fullname) === '' || trim($email) === '' || $age === '') {
        sendError(400, "Todos los campos son obligatorios.");
        return false;
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendError(400, "El email ingresado no es válido.");
        return false;
    }
    if (!is_numeric($age) || intval($age) < 18 || intval($age) > 100) {
        sendError(400, "Por favor, ingrese una edad válida entre 18 y 100.");
        return false;
    }
    return true;
}

function handlePost($conn) {
    $input = json_decode(file_get_contents("php://input"), true);
    $fullname = trim($input['fullname'] ?? '');
    $email = trim($input['email'] ?? '');
    $age = $input['age'] ?? '';

    if (!validarDatosProfesor($fullname, $email, $age)) return;

    $result = createTeacher($conn, $fullname, $email, intval($age));

    if ($result['inserted'] > 0) {
        sendSuccess("Profesor agregado correctamente.");
    } else if (($result['error_code'] ?? null) == 1062) {
        sendError(400, "El email del profesor ya está registrado.");
    } else {
        sendError(400, "Ocurrió un error inesperado al agregar al profesor.");
    }
}

function handlePut($conn) {
    $input = json_decode(file_get_contents("php://input"), true);
    $fullname = trim($input['fullname'] ?? '');
    $email = trim($input['email'] ?? '');
    $age = $input['age'] ?? '';

    if (!validarDatosProfesor($fullname, $email, $age)) return;

    $result = updateTeacher($conn, $input['id'], $fullname, $email, $age);

    if ($result['updated'] > 0) {
        sendSuccess("Profesor actualizado correctamente");
    } else if (($result['error_code'] ?? null) == 1062) {
        sendError(400, "El email del profesor ya está registrado.");
    } else {
        sendError(400, "Ocurrió un error inesperado al editar al profesor.");
    }
}

function handleDelete($conn) {
    $input = json_decode(file_get_contents("php://input"), true);

    $result = deleteTeacher($conn, $input['id']);

    if (($result['deleted'] ?? 0) > 0) {
        sendSuccess("Profesor eliminado correctamente.");
    } else if (($result['error_code'] ?? null) == 1451) {
        sendError(400, "No se puede borrar el profesor porque está asignado a una o más materias.");
    } else {
        sendError(400, "Ocurrió un error inesperado al borrar al profesor.");
    }
}