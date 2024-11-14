<?php
// CORS headers to allow cross-origin requests
header("Access-Control-Allow-Origin: *"); // Allow requests from any origin (you can restrict this to specific origins if needed)
header("Access-Control-Allow-Methods: POST, GET, OPTIONS"); // Allow methods
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allow specific headers

// Handle preflight (OPTIONS) request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Handle preflight request by returning OK status
    http_response_code(200);
    exit;
}

// Database connection details
$servername = "localhost";
$username = "root"; // Default username for WAMP
$password = ""; // Default password is empty
$dbname = "animal_care"; // Your database name

// Create connection to MySQL
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Handle POST request
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Decode JSON data from request
    $data = json_decode(file_get_contents("php://input"));
    
    // Ensure the 'action' parameter exists
   
        // Delete Process
        $id = isset($data->id) ? $conn->real_escape_string($data->id) : '';

        // Validate required field for delete
        if (empty($id)) {
            echo json_encode(array("status" => "error", "message" => "Customer ID is required for deletion"));
            exit;
        }

        // Delete customer record
        $sql = "DELETE FROM customers WHERE id = '$id'";

        if ($conn->query($sql) === TRUE) {
            $response = array("status" => "success", "message" => "Customer deleted successfully");
        } else {
            $response = array("status" => "error", "message" => "Error deleting customer: " . $conn->error);
        }

        echo json_encode($response);
        exit;
   
}

// Close connection
$conn->close();
?>
