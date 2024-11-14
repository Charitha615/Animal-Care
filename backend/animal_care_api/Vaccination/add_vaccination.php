<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight requests
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

// Check if the request method is POST for adding vaccination details
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Read JSON input from the request body
    $data = json_decode(file_get_contents("php://input"), true);
    
    // Extract and validate input data
    $pet_id = intval($data['pet_id'] ?? 0);
    $vaccination_name = $data['vaccination_name'] ?? '';
    $vaccination_date = $data['vaccination_date'] ?? '';
    $status = 'upcoming'; // Status is set as 'upcoming' as per your requirement

    // Log received data for debugging (optional)
    error_log("Pet ID: " . $pet_id);
    error_log("Vaccination Name: " . $vaccination_name);
    error_log("Vaccination Date: " . $vaccination_date);

    // Validate inputs
    if ($pet_id <= 0 || empty($vaccination_name) || empty($vaccination_date)) {
        http_response_code(400);
        echo json_encode(array("status" => "error", "message" => "Invalid input data."));
        exit;
    }

    // Prepare SQL statement to insert vaccination data
    $stmt = $conn->prepare("INSERT INTO vaccinations (pet_id, vaccination_name, vaccination_date, status) VALUES (?, ?, ?, ?)");
    if ($stmt) {
        $stmt->bind_param("isss", $pet_id, $vaccination_name, $vaccination_date, $status);
        
        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(array("status" => "success", "message" => "Vaccination details added successfully."));
        } else {
            http_response_code(500);
            echo json_encode(array("status" => "error", "message" => "Failed to add vaccination details."));
        }
        $stmt->close();
    } else {
        http_response_code(500);
        echo json_encode(array("status" => "error", "message" => "Failed to prepare the SQL statement."));
    }
    $conn->close();
} else {
    http_response_code(405);
    echo json_encode(array("status" => "error", "message" => "Invalid request method."));
}
?>
