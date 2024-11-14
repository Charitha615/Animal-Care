<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
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

// Handle POST request
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    try {
        // Decode JSON data from request
        $data = json_decode(file_get_contents('php://input'), true);

        // Check if required fields are present
        if (isset($data['user_id'], $data['feedback_type'], $data['comments'])) {
            $user_id = $conn->real_escape_string($data['user_id']);
            $feedback_type = $conn->real_escape_string($data['feedback_type']);
            $comments = $conn->real_escape_string($data['comments']);

            // Insert the feedback into the database
            $sql = "INSERT INTO feedback (user_id, feedback_type, comments) 
                    VALUES ('$user_id', '$feedback_type', '$comments')";

            if ($conn->query($sql) === TRUE) {
                http_response_code(201);
                echo json_encode(array("status" => "success", "message" => "Feedback submitted successfully."));
            } else {
                throw new Exception("Failed to insert feedback: " . $conn->error);
            }
        } else {
            http_response_code(400);
            echo json_encode(array("status" => "error", "message" => "Missing required fields."));
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(array("status" => "error", "message" => $e->getMessage()));
    }
}

$conn->close();
?>
