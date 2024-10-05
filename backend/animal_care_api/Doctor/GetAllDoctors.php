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


$servername = "localhost";
$username = "root";
$password = "";
$dbname = "animal_care";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $query = "SELECT * FROM doctors";
    $result = $conn->query($query);

    $doctors = array();

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $doctors[] = $row;
        }
        echo json_encode(array("status" => "success", "doctors" => $doctors));
    } else {
        echo json_encode(array("status" => "error", "message" => "No doctors found"));
    }
}

$conn->close();
?>
