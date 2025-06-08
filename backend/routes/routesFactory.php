<?php
/**
*    File        : backend/routes/routesFactory.php
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*    Iteration   : 3.0 ( prototype )
*/

require_once __DIR__ . '/../helpers/utils.php';

function routeRequest($conn, $customHandlers = [], $prefix = 'handle') {
    $method = $_SERVER['REQUEST_METHOD'];

    // Lista de handlers CRUD por defecto
    $defaultHandlers = [
        'GET'    => $prefix . 'Get',
        'POST'   => $prefix . 'Post',
        'PUT'    => $prefix . 'Put',
        'DELETE' => $prefix . 'Delete'
    ];

    // Sobrescribir handlers por defecto si hay personalizados
    $handlers = array_merge($defaultHandlers, $customHandlers);

    if (!isset($handlers[$method])) {
        sendError(405, "Operación no permitida.");
        return;
    }

    $handler = $handlers[$method];

    if (is_callable($handler)) {
        $handler($conn);
        exit;
    } else {
        sendError(500, "Ocurrió un error inesperado.");
        exit;
    }
}
