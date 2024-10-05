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

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['doctor_id'])) {
        $doctor_id = $conn->real_escape_string($_GET['doctor_id']);

        $query = "SELECT * FROM doctors WHERE id = '$doctor_id'";
        $result = $conn->query($query);

        if ($result->num_rows > 0) {
            $doctor = $result->fetch_assoc();
            echo json_encode(array("status" => "success", "doctor" => $doctor));
        } else {
            echo json_encode(array("status" => "error", "message" => "Doctor not found"));
        }
    } else {
        echo json_encode(array("status" => "error", "message" => "Doctor ID is required"));
    }
}

$conn->close();
?>
