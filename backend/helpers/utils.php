<?php
function sendSuccess($message) {
    http_response_code(200);
    echo json_encode(["message" => $message]);
    exit;
}

function sendError($code, $message) {
    http_response_code($code);
    echo json_encode(["error" => $message]);
    exit;
}
?>