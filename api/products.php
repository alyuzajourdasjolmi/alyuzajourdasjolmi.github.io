<?php
include 'db.php';


$method = $_SERVER['REQUEST_METHOD'];
header('Content-Type: application/json');

switch ($method) {
    case 'GET':
        $sql = "SELECT * FROM products ORDER BY id DESC";
        $result = $conn->query($sql);
        $products = [];
        while ($row = $result->fetch_assoc()) {
            $products[] = $row;
        }
        echo json_encode($products);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data) {
             echo json_encode(["status" => "error", "message" => "No data provided"]);
             break;
        }
        
        $name = $data['name'];
        $price = $data['price'];
        $image = $data['image'];
        $category = $data['category'];

        $sql = "INSERT INTO products (name, price, image, category) VALUES ('$name', '$price', '$image', '$category')";
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["status" => "success"]);
        } else {
            echo json_encode(["status" => "error", "message" => $conn->error]);
        }
        break;

    case 'DELETE':
        $id = $_GET['id'];
        $sql = "DELETE FROM products WHERE id=$id";
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["status" => "success"]);
        } else {
            echo json_encode(["status" => "error", "message" => $conn->error]);
        }
        break;
        
    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $data['id']; // Assumes ID is passed via body for simplicity
        
        // This is a simplified UPDATE, usually you'd check what fields to update
        $name = $data['name'];
        $price = $data['price'];
        $image = $data['image'];
        $category = $data['category'];
        
        $sql = "UPDATE products SET name='$name', price='$price', image='$image', category='$category' WHERE id=$id";
         if ($conn->query($sql) === TRUE) {
            echo json_encode(["status" => "success"]);
        } else {
            echo json_encode(["status" => "error", "message" => $conn->error]);
        }
        break;
}

$conn->close();
