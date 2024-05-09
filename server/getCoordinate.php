<?php
date_default_timezone_set('Asia/Manila'); // Set your timezone here

if ($_SERVER['REQUEST_METHOD'] === "GET")
{
    if(isset($_GET['name']))
    {
        $name = $_GET['name'];
        getCoordinate($name);
    }
}else{
    try {
        require 'conn.php';
        $name = $_POST['name'];
        $coordinate = $_POST['coordinate'];
        $now = date("Y-m-d H:i:s");
        $sql = "INSERT INTO grieve (name, coordinate, created_at) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$name, $coordinate, $now]);

        header("Location: data.php");
    } catch(PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
    $conn = null;
}

function getCoordinate($name)
{
    require 'conn.php';
    try {
        $sql = "SELECT coordinate FROM grieve WHERE name = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$name]);
         // Fetch the result
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        if($result){
            echo $result['coordinate']; // Return the coordinate value
        }else{
            echo "Error";
        }
        
    } catch (PDOException $ex) {
        echo "Error:" . $ex->getMessage();
    }
    $conn = null;
}
?>