<?php
// CORS headers to allow cross-origin requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Database connection details
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "animal_care";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Handle OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Handle GET request to fetch all users
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $sql = "SELECT id, nic, customer_name, address, phone_no, email FROM customers";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $users = array();
        
        while ($row = $result->fetch_assoc()) {
            $users[] = $row;
        }
        
        echo json_encode(array("status" => "success", "data" => $users));
    } else {
        echo json_encode(array("status" => "error", "message" => "No users found"));
    }

    exit;
}

// Close connection
$conn->close();
?>
