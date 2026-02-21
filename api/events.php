<?php
include 'db.php';

header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $sql = "SELECT * FROM events ORDER BY id DESC";
        $result = $conn->query($sql);
        
        if ($result === false) {
            echo json_encode(["status" => "error", "message" => "Query failed: " . $conn->error]);
            break;
        }
        
        $events = [];
        while ($row = $result->fetch_assoc()) {
            $events[] = $row;
        }
        echo json_encode($events);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!$data || !isset($data['title']) || !isset($data['description'])) {
            echo json_encode(["status" => "error", "message" => "Title and description are required"]);
            break;
        }
        
        $title = $conn->real_escape_string($data['title']);
        $description = $conn->real_escape_string($data['description']);
        $event_day = intval($data['event_day']);
        $event_month = $conn->real_escape_string($data['event_month']);

        $sql = "INSERT INTO events (title, description, event_day, event_month) VALUES ('$title', '$description', $event_day, '$event_month')";
        
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["status" => "success", "id" => $conn->insert_id]);
        } else {
            echo json_encode(["status" => "error", "message" => $conn->error]);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!$data || !isset($data['id'])) {
            echo json_encode(["status" => "error", "message" => "Event ID is required"]);
            break;
        }
        
        $id = intval($data['id']);
        $title = $conn->real_escape_string($data['title']);
        $description = $conn->real_escape_string($data['description']);
        $event_day = intval($data['event_day']);
        $event_month = $conn->real_escape_string($data['event_month']);
        
        $sql = "UPDATE events SET title='$title', description='$description', event_day=$event_day, event_month='$event_month' WHERE id=$id";
        
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["status" => "success"]);
        } else {
            echo json_encode(["status" => "error", "message" => $conn->error]);
        }
        break;

    case 'DELETE':
        if (!isset($_GET['id'])) {
            echo json_encode(["status" => "error", "message" => "Event ID is required"]);
            break;
        }
        
        $id = intval($_GET['id']);
        $sql = "DELETE FROM events WHERE id=$id";
        
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["status" => "success"]);
        } else {
            echo json_encode(["status" => "error", "message" => $conn->error]);
        }
        break;
        
    default:
        echo json_encode(["status" => "error", "message" => "Method not allowed"]);
        break;
}

$conn->close();
