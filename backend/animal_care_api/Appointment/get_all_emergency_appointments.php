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

// Handle POST request
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    try {
        // Decode JSON data from request
        $data = json_decode(file_get_contents("php://input"));
            $sql = "SELECT * FROM emergency_appointments";
            $result = $conn->query($sql);

            if ($result->num_rows > 0) {
                $appointments = array();
                while ($row = $result->fetch_assoc()) {
                    $appointments[] = $row;
                }
                echo json_encode(array("status" => "success", "data" => $appointments));
            } else {
                echo json_encode(array("status" => "success", "data" => [], "message" => "No emergency appointments found"));
            }

        // Place additional actions (e.g., register, get by user, etc.) here...

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(array("status" => "error", "message" => $e->getMessage()));
    }
}
?>
