<?php
function logError($message) {
    $logFile = __DIR__ . '/../logs/error.log';
    $date = date('Y-m-d H:i:s');
    $entry = "[$date] $message\n";
    file_put_contents($logFile, $entry, FILE_APPEND | LOCK_EX);
}

function sendSuccess($message) {
    http_response_code(200);
    echo json_encode(["message" => $message]);
    exit;
}

function sendError($code, $message) {
    // Loguear el error antes de responder
    $trace = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 2);
    $caller = isset($trace[1]) ? $trace[1] : null;
    $location = $caller ? ($caller['file'] . ':' . $caller['line']) : '';
    logError("[$code] $message $location");

    http_response_code($code);
    echo json_encode(["error" => $message]);
    exit;
}
?>