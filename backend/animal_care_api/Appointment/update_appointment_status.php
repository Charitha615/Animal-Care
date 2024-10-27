<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, PATCH, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Database connection details
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "animal_care";

// Create connection to MySQL
try {
    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        throw new Exception("Database connection failed: " . $conn->connect_error);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("status" => "error", "message" => $e->getMessage()));
    exit;
}

// Check if the request method is PATCH for updating appointment status
if ($_SERVER['REQUEST_METHOD'] == 'PATCH') {
    // Get the input data from the request
    $data = json_decode(file_get_contents("php://input"), true);

    // Check if the appointment ID and new status are provided
    if (!empty($data['appointmentId']) && !empty($data['status'])) {
        $appointmentId = intval($data['appointmentId']); // Sanitize input
        $status = $data['status'];

        // Prepare the SQL query to update the appointment status
        $stmt = $conn->prepare("UPDATE appointments SET status = ? WHERE id = ?");
        $stmt->bind_param("si", $status, $appointmentId);

        // Execute the query and check if successful
        if ($stmt->execute() && $stmt->affected_rows > 0) {
            echo json_encode(array("status" => "success", "message" => "Appointment status updated successfully"));
        } else {
            http_response_code(404);
            echo json_encode(array("status" => "error", "message" => "Appointment not found or status unchanged"));
        }

        $stmt->close();
    } else {
        // If any required field is missing, return an error
        http_response_code(400);
        echo json_encode(array("status" => "error", "message" => "Appointment ID and new status are required"));
    }
} else {
    // If request method is not PATCH, return an error
    http_response_code(405);
    echo json_encode(array("status" => "error", "message" => "Method not allowed"));
}

$conn->close();
?>
