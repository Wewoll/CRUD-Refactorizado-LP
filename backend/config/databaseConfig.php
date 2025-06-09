<?php
/**
*    File        : backend/config/databaseConfig.php
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*    Iteration   : 3.0 ( prototype )
*/

require_once __DIR__ . '/../helpers/utils.php';

$host = "localhost";
$user = "academic_user";
$password = "12345";
$database = "academic_db";

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    sendError(500, "No se pudo conectar a la base de datos.");
    exit;
}
?>