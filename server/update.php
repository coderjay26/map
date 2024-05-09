<?php
require 'conn.php';

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['id'])) {
    $id = $_POST['id'];
    $name = $_POST['name'];
    $coordinate = $_POST['coordinate'];
    
    // Update the item in the database
    $stmt = $conn->prepare("UPDATE grieve SET name = ?, coordinate = ? WHERE id = ?");
    $stmt->execute([$name, $coordinate, $id]);

    header("Location: data.php");
} else {
    header("Location: edit.php?error=1");
}
?>
