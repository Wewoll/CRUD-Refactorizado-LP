<?php
/**
*    File        : backend/models/subjects.php
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*    Iteration   : 3.0 ( prototype )
*/

function getAllSubjects($conn) {
    $sql = "SELECT * FROM subjects";

    return $conn->query($sql)->fetch_all(MYSQLI_ASSOC);
}

function getSubjectById($conn, $id) {
    $sql = "SELECT * FROM subjects WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();

    return $result->fetch_assoc(); 
}

function createSubject($conn, $name) {
    try {
        $sql = "INSERT INTO subjects (name) VALUES (?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $name);
        $stmt->execute();
        $inserted = $stmt->affected_rows;
        $id = $conn->insert_id;
        $stmt->close();
        
        return [
            'inserted' => $inserted,
            'id' => $id
        ];

    } catch (mysqli_sql_exception $e) {
        return [
            'inserted' => 0,
            'error_code' => $e->getCode(), // Código de error SQL
            'error' => $e->getMessage()    // Mensaje técnico (opcional, para logs)
        ];
    }
}

function updateSubject($conn, $id, $name) {
    try {
        $sql = "UPDATE subjects SET name = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("si", $name, $id);
        $stmt->execute();
        $updated = $stmt->affected_rows;
        $stmt->close();

        return ['updated' => $updated];

    } catch (mysqli_sql_exception $e) {
        return [
            'updated' => 0,
            'error_code' => $e->getCode(),
            'error' => $e->getMessage()
        ];
    }
}

function deleteSubject($conn, $id) {
    try {
        $sql = "DELETE FROM subjects WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $deleted = $stmt->affected_rows;
        $stmt->close();

        return ['deleted' => $deleted];

    } catch (mysqli_sql_exception $e) {
        return [
            'deleted' => 0,
            'error_code' => $e->getCode(),
            'error' => $e->getMessage()
        ];
    }
}
?>
