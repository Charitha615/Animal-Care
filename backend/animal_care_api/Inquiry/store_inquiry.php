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
        $data = json_decode(file_get_contents('php://input'), true);

        // Check if required fields are present
        if (isset($data['user_id'], $data['name'], $data['email'], $data['subject'], $data['message'])) {
            $user_id = $conn->real_escape_string($data['user_id']);
            $name = $conn->real_escape_string($data['name']);
            $email = $conn->real_escape_string($data['email']);
            $subject = $conn->real_escape_string($data['subject']);
            $message = $conn->real_escape_string($data['message']);

            // Insert the inquiry into the database
            $sql = "INSERT INTO inquiries (user_id, name, email, subject, message) 
                    VALUES ('$user_id', '$name', '$email', '$subject', '$message')";

            if ($conn->query($sql) === TRUE) {
                echo json_encode(array("status" => "success", "message" => "Inquiry submitted successfully"));
            } else {
                throw new Exception("Error inserting inquiry: " . $conn->error);
            }
        } else {
            http_response_code(400);
            echo json_encode(array("status" => "error", "message" => "Missing required fields"));
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(array("status" => "error", "message" => $e->getMessage()));
    }
}

// Close the database connection
$conn->close();
?>
