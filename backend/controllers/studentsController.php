<?php
/**
*    File        : backend/controllers/studentsController.php
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*    Iteration   : 3.0 ( prototype )
*/

require_once("./models/students.php");
require_once __DIR__ . '/../helpers/utils.php';

function handleGet($conn) {
    $input = json_decode(file_get_contents("php://input"), true);
    
    if (isset($input['id'])) {
        $student = getStudentById($conn, $input['id']);
        echo json_encode($student);
    } else{
        $students = getAllStudents($conn);
        echo json_encode($students);
    }
}

function handlePost($conn) {
    $input = json_decode(file_get_contents("php://input"), true);
    $fullname = trim($input['fullname'] ?? '');
    $email = trim($input['email'] ?? '');
    $age = $input['age'] ?? '';

    // Validación de campos obligatorios
    if ($fullname === '' || $email === '' || $age === '') {
        sendError(400, "Todos los campos son obligatorios.");
        return;
    }

    // Validación de email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendError(400, "El email ingresado no es válido.");
        return;
    }

    // Validación de edad (opcional, pero recomendable)
    if (!is_numeric($age) || intval($age) <= 0 || intval($age) > 100) {
        sendError(400, "Por favor, ingrese una edad válida entre 1 y 100.");
        return;
    }

    $result = createStudent($conn, $fullname, $email, intval($age));

    if ($result['inserted'] > 0) {
        sendSuccess("Estudiante agregado correctamente.");
    } else if (($result['error_code'] ?? null) == 1062) {
        sendError(400, "El email del estudiante ya está registrado.");
    } else {
        sendError(400, "Ocurrió un error inesperado al agregar al estudiante.");
    }
}


function handlePut($conn) {
    $input = json_decode(file_get_contents("php://input"), true);

    $result = updateStudent($conn, $input['id'], $input['fullname'], $input['email'], $input['age']);

    if ($result['updated'] > 0) {
        sendSuccess("Estudiante actualizado correctamente");
    } else if (($result['error_code'] ?? null) == 1062) {
        sendError(400, "El email del estudiante ya está registrado.");
    } else {
        sendError(400, "Ocurrió un error inesperado al editar al estudiante.");
    }
}

function handleDelete($conn) {
    $input = json_decode(file_get_contents("php://input"), true);

    $result = deleteStudent($conn, $input['id']);

    if (($result['deleted'] ?? 0) > 0) {
        sendSuccess("Estudiante eliminado correctamente.");
    } else if (($result['error_code'] ?? null) == 1451) {
        sendError(400, "No se puede borrar el estudiante porque está asignado a una o más materias.");
    } else {
        sendError(400, "Ocurrió un error inesperado al borrar al estudiante.");
    }
}
?>