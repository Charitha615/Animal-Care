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

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Read and decode the JSON input
    $input = json_decode(file_get_contents("php://input"), true);

    // Log input data for debugging
    file_put_contents('debug_log.txt', "Received input: " . json_encode($input) . "\n", FILE_APPEND);

    // Check if JSON parsing was successful
    if (json_last_error() !== JSON_ERROR_NONE) {
        file_put_contents('debug_log.txt', "JSON parsing error: " . json_last_error_msg() . "\n", FILE_APPEND);
        http_response_code(400);
        echo json_encode(array("status" => "error", "message" => "Invalid JSON input."));
        exit;
    }

    // Extract and validate input data
    $vaccination_id = intval($input['vaccination_id'] ?? 0);
    $status = $input['status'] ?? '';

    // Log parsed input for debugging
    file_put_contents('debug_log.txt', "Parsed data - vaccination_id: {$vaccination_id}, status: {$status}\n", FILE_APPEND);

    if ($vaccination_id <= 0 || empty($status)) {
        file_put_contents('debug_log.txt', "Invalid data detected\n", FILE_APPEND);
        http_response_code(400);
        echo json_encode(array("status" => "error", "message" => "Invalid input data."));
        exit;
    }

    // Prepare SQL statement to update vaccination status
    $stmt = $conn->prepare("UPDATE vaccinations SET status = ? WHERE id = ?");
    if ($stmt) {
        $stmt->bind_param("si", $status, $vaccination_id);
        
        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(array("status" => "success", "message" => "Vaccination status updated successfully."));
       
        }
        $stmt->close();
    } else {
        file_put_contents('debug_log.txt', "Prepare error: " . $conn->error . "\n", FILE_APPEND);
        http_response_code(500);
        echo json_encode(array("status" => "error", "message" => "Failed to prepare the SQL statement."));
    }
    $conn->close();
} else {
    http_response_code(405);
    echo json_encode(array("status" => "error", "message" => "Invalid request method."));
}
?>
