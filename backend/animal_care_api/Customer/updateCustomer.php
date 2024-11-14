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

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!isset($data->action)) {
        echo json_encode(array("status" => "error", "message" => "Action is required"));
        exit;
    }

    // Determine the action type (register, login, or update)
    $action = $conn->real_escape_string($data->action);

    if  ($action == "update") {
        // Update Process
        $id = isset($data->id) ? $conn->real_escape_string($data->id) : '';
        $customer_name = isset($data->customer_name) ? $conn->real_escape_string($data->customer_name) : '';
        $address = isset($data->address) ? $conn->real_escape_string($data->address) : '';
        $phone_no = isset($data->phone_no) ? $conn->real_escape_string($data->phone_no) : '';
        $email = isset($data->email) ? $conn->real_escape_string($data->email) : '';

        // Validate required fields for update
        if (empty($id) || empty($customer_name) || empty($address) || empty($phone_no) || empty($email)) {
            echo json_encode(array("status" => "error", "message" => "All fields are required for update"));
            exit;
        }

        // Validate email format
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo json_encode(array("status" => "error", "message" => "Invalid email format"));
            exit;
        }

        // Update customer record
        $sql = "UPDATE customers SET 
                    customer_name = '$customer_name', 
                    address = '$address', 
                    phone_no = '$phone_no', 
                    email = '$email' 
                WHERE id = '$id'";

        if ($conn->query($sql) === TRUE) {
            $sql = "SELECT id, nic, customer_name, address, phone_no, email FROM customers WHERE id = '$id'";
            $result = $conn->query($sql);

            if ($result->num_rows > 0) {
                $customer_details = $result->fetch_assoc();
                $response = array("status" => "success", "message" => "Customer updated successfully", "customer" => $customer_details);
            } else {
                $response = array("status" => "error", "message" => "Customer updated but unable to fetch details");
            }
        } else {
            $response = array("status" => "error", "message" => "Error updating customer: " . $conn->error);
        }

        echo json_encode($response);
        exit;
    } else {
        // Invalid action
        echo json_encode(array("status" => "error", "message" => "Invalid action"));
        exit;
    }
}

// Close connection
$conn->close();
?>
