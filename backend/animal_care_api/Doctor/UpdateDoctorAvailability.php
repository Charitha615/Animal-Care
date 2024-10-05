<?php

// CORS headers to allow cross-origin requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight (OPTIONS) request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Include DB connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "animal_care";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['doctor_id']) && isset($data['available_start_time']) && isset($data['available_end_time'])) {
        $doctor_id = $conn->real_escape_string($data['doctor_id']);
        $available_start_time = $conn->real_escape_string($data['available_start_time']);
        $available_end_time = $conn->real_escape_string($data['available_end_time']);

        $query = "UPDATE doctors SET available_start_time = '$available_start_time', available_end_time = '$available_end_time' WHERE id = '$doctor_id'";

        if ($conn->query($query) === TRUE) {
            echo json_encode(array("status" => "success", "message" => "Availability updated successfully"));
        } else {
            echo json_encode(array("status" => "error", "message" => "Error updating availability: " . $conn->error));
        }
    } else {
        echo json_encode(array("status" => "error", "message" => "Doctor ID, start time, and end time are required"));
    }
}

$conn->close();
?>
