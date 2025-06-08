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

function handleGet($conn) 
{
    $input = json_decode(file_get_contents("php://input"), true);
    
    if (isset($input['id'])) 
    {
        $student = getStudentById($conn, $input['id']);
        echo json_encode($student);
    } 
    else
    {
        $students = getAllStudents($conn);
        echo json_encode($students);
    }
}

function handlePost($conn) 
{
    $input = json_decode(file_get_contents("php://input"), true);

    $result = createStudent($conn, $input['fullname'], $input['email'], $input['age']);

    if ($result['inserted'] > 0) {
        sendSuccess("Estudiante agregado correctamente");
    } else if (($result['error_code'] ?? null) == 1062) {
        sendError(400, "El email del estudiante ya está registrado.");
    } else {
        sendError(400, "Ocurrió un error inesperado al agregar al estudinte.");
    }
}


function handlePut($conn) 
{
    $input = json_decode(file_get_contents("php://input"), true);

    $result = updateStudent($conn, $input['id'], $input['fullname'], $input['email'], $input['age']);
    if ($result['updated'] > 0) 
    {
        echo json_encode(["message" => "Actualizado correctamente"]);
    } 
    else 
    {
        http_response_code(500);
        echo json_encode(["error" => "No se pudo actualizar"]);
    }
}

function handleDelete($conn) 
{
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