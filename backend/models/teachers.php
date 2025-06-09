<?php
/**
*    File        : backend/models/teachers.php
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Junio 2025
*    Status      : Prototype
*    Iteration   : 1.0
*/

function getAllTeachers($conn) {
    $sql = "SELECT * FROM teachers";
    return $conn->query($sql)->fetch_all(MYSQLI_ASSOC);
}

function getTeacherById($conn, $id) {
    $stmt = $conn->prepare("SELECT * FROM teachers WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
    return $result->fetch_assoc(); 
}

function createTeacher($conn, $fullname, $email, $age) {
    try {
        $stmt = $conn->prepare("INSERT INTO teachers (fullname, email, age) VALUES (?, ?, ?)");
        $stmt->bind_param("ssi", $fullname, $email, $age);
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
            'error_code' => $e->getCode(),
            'error' => $e->getMessage()
        ];
    }
}

function updateTeacher($conn, $id, $fullname, $email, $age) {
    try {
        $sql = "UPDATE teachers SET fullname = ?, email = ?, age = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssii", $fullname, $email, $age, $id);
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

function deleteTeacher($conn, $id) {
    try {
        $sql = "DELETE FROM teachers WHERE id = ?";
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