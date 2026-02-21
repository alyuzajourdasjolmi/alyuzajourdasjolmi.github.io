<?php
// CORS headers - must be at the very top
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Database connection
$host = "localhost";
$username = "root";
$password = "";
$database = "hijrah_toko";

$conn = new mysqli($host, $username, $password, $database);

if ($conn->connect_error) {
    header("Content-Type: application/json");
    die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
}
