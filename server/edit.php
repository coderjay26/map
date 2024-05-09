<!DOCTYPE html>
<html>
<head>
    <title>Edit Item</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        h2 {
            margin-top: 0;
            color: #333;
        }
        label {
            display: block;
            margin-bottom: 5px;
            color: #666;
        }
        input[type="text"] {
            width: 100%;
            padding: 8px;
            margin-bottom: 10px;
            border: 1px solid #ccc;
            border-radius: 3px;
        }
        input[type="submit"] {
            background-color: #007bff;
            color: #fff;
            padding: 10px 20px;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        }
        input[type="submit"]:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="container">
        <?php
        require 'conn.php';

        if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET['id'])) {
            $id = $_GET['id'];

            // Fetch the data of the selected item
            $stmt = $conn->prepare("SELECT id, name, coordinate, created_at, updated_at FROM grieve WHERE id = ?");
            $stmt->execute([$id]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($row) {
                echo "<h2>Edit Item</h2>";
                echo "<form action='update.php' method='post'>";
                echo "<input type='hidden' name='id' value='{$row['id']}'>";
                echo "<label for='name'>Name:</label>";
                echo "<input type='text' id='name' name='name' value='{$row['name']}' required>";
                echo "<label for='coordinate'>Coordinate:</label>";
                echo "<input type='text' id='coordinate' name='coordinate' value='{$row['coordinate']}' required>";
                echo "<input type='submit' value='Update'>";
                echo "</form>";
            } else {
                echo "Item not found.";
            }
        } else if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET['error'])) {
            echo "Invalid request.";
        } else {
            echo "Invalid request.";
        }
        ?>
    </div>
</body>
</html>
