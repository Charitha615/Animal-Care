<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
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

// Function to get appointments by user_id
function getAppointments($conn, $user_id) {
    $appointments = array();
    $sql = "SELECT * FROM appointments WHERE user_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    while ($row = $result->fetch_assoc()) {
        $appointments[] = $row;
    }
    return $appointments;
}

// Function to get emergency appointments by user_id
function getEmergencyAppointments($conn, $user_id) {
    $emergency_appointments = array();
    $sql = "SELECT * FROM emergency_appointments WHERE user_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    while ($row = $result->fetch_assoc()) {
        $emergency_appointments[] = $row;
    }
    return $emergency_appointments;
}

// Get user_id from request
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['user_id'])) {
    $user_id = intval($_GET['user_id']);

    // Fetch the appointments and emergency appointments
    $appointments = getAppointments($conn, $user_id);
    $emergency_appointments = getEmergencyAppointments($conn, $user_id);

    // Prepare response
    $response = array(
        "status" => "success",
        "appointments" => $appointments,
        "emergency_appointments" => $emergency_appointments
    );
    
    // Send response
    echo json_encode($response);

} else {
    http_response_code(400);
    echo json_encode(array("status" => "error", "message" => "Invalid request. Please provide a user_id."));
}

// Close the connection
$conn->close();
?>
