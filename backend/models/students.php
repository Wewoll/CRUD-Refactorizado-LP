<?php
/**
*    File        : backend/models/students.php
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*    Iteration   : 3.0 ( prototype )
*/

function getAllStudents($conn) {
    $sql = "SELECT * FROM students";

    //MYSQLI_ASSOC devuelve un array ya listo para convertir en JSON:
    return $conn->query($sql)->fetch_all(MYSQLI_ASSOC);
}

function getStudentById($conn, $id) {
    $stmt = $conn->prepare("SELECT * FROM students WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();

    //fetch_assoc() devuelve un array asociativo ya listo para convertir en JSON de una fila:
    return $result->fetch_assoc(); 
}

function createStudent($conn, $fullname, $email, $age) {
    try {
        $stmt = $conn->prepare("INSERT INTO students (fullname, email, age) VALUES (?, ?, ?)");
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
            'error_code' => $e->getCode(), // Código de error SQL
            'error' => $e->getMessage()    // Mensaje técnico (opcional, para logs)
        ];
    }
}

function updateStudent($conn, $id, $fullname, $email, $age) {
    try {
        $sql = "UPDATE students SET fullname = ?, email = ?, age = ? WHERE id = ?";
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

function deleteStudent($conn, $id) {
    try {
        $sql = "DELETE FROM students WHERE id = ?";
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