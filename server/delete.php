<?php
require 'conn.php';

if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET['id'])) {
    $id = $_GET['id'];

    // Delete the item from the database
    $stmt = $conn->prepare("DELETE FROM grieve WHERE id = ?");
    $stmt->execute([$id]);

    header("Location: data.php?success=1");
} else {
    header("Location: data.php?error=1");
}
?>
