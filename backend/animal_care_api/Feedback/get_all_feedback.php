<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
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

try {
    // Create connection to MySQL
    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        throw new Exception("Database connection failed: " . $conn->connect_error);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("status" => "error", "message" => $e->getMessage()));
    exit;
}

// Handle GET request
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    try {
        $sql = "SELECT * FROM feedback";
        $result = $conn->query($sql);

        $feedbacks = array();
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $feedbacks[] = $row;
            }
            http_response_code(200);
            echo json_encode(array("status" => "success", "data" => $feedbacks));
        } else {
            http_response_code(200);
            echo json_encode(array("status" => "success", "data" => []));
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(array("status" => "error", "message" => $e->getMessage()));
    }
}

$conn->close();
?>
