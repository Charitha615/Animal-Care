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

// Database connection details
$servername = "localhost";
$username = "root"; // Default username for WAMP/MAMP
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

    // Ensure the required parameters exist
    if (!isset($data->email) || !isset($data->password) || !isset($data->user_type)) {
        echo json_encode(array("status" => "error", "message" => "Email, password, and user_type are required"));
        exit;
    }

    // Retrieve and sanitize input data
    $email = $conn->real_escape_string($data->email);
    $password = $conn->real_escape_string($data->password);
    $user_type = $conn->real_escape_string($data->user_type);

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response = array("status" => "error", "message" => "Invalid email format");
        echo json_encode($response);
        exit;
    }

    // Check the user type and set the appropriate table
    $table = "";
    switch ($user_type) {
        case 'staff':
            $table = "staff";
            break;
        case 'customer':
            $table = "customers";
            break;
        case 'doctor':
            $table = "doctors";
            break;
        case 'service_provider':
            $table = "service_providers";
            break;
        default:
            echo json_encode(array("status" => "error", "message" => "Invalid user type"));
            exit;
    }

    // Check if the user exists with the given email
    $sql = "SELECT * FROM $table WHERE email = '$email'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();

        // Verify the password
        if (password_verify($password, $user['password'])) {
            unset($user['password']); // Remove password from the response
            $user['user_type'] = $user_type; // Add user_type to the user object
            $response = array("status" => "success", "message" => "Login successful", "user" => $user);
        } else {
            $response = array("status" => "error", "message" => "Invalid password");
        }
    } else {
        $response = array("status" => "error", "message" => "Email not found");
    }

    // Send response
    echo json_encode($response);
    exit;
}

// Close connection
$conn->close();
?>
