<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 0); // Don't display, but log

// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
    exit();
}

// Include database connection
include 'db.php';

// Get input data
$inputRaw = file_get_contents("php://input");
$data = json_decode($inputRaw, true);

// Validate input
if (!$data || !isset($data['email']) || !isset($data['password'])) {
    echo json_encode(["status" => "error", "message" => "Email and password are required"]);
    exit();
}

$email = $conn->real_escape_string($data['email']);
$password = $conn->real_escape_string($data['password']);

// Query database
$sql = "SELECT id, email FROM users WHERE email='$email' AND password='$password'";
$result = $conn->query($sql);

if ($result === false) {
    echo json_encode(["status" => "error", "message" => "Database query failed"]);
    $conn->close();
    exit();
}

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    echo json_encode(["status" => "success", "user" => $user]);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid credentials"]);
}

$conn->close();
