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
    if (!isset($data->action)) {
        echo json_encode(array("status" => "error", "message" => "Action is required"));
        exit;
    }

    // Determine if the request is for registration or login
    $action = $conn->real_escape_string($data->action);

    if ($action == "register") {
        // Registration Process
        $nic = $conn->real_escape_string($data->nic);
        $customer_name = $conn->real_escape_string($data->customer_name);
        $address = $conn->real_escape_string($data->address);
        $phone_no = $conn->real_escape_string($data->phone_no);
        $email = $conn->real_escape_string($data->email);
        $password = $conn->real_escape_string($data->password);

        // Validate required fields
        if (empty($nic) || empty($customer_name) || empty($address) || empty($phone_no) || empty($email) || empty($password)) {
            $response = array("status" => "error", "message" => "All fields are required");
            echo json_encode($response);
            exit;
        }

        // Validate email format
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $response = array("status" => "error", "message" => "Invalid email format");
            echo json_encode($response);
            exit;
        }

        // Check if email already exists
        $checkEmailQuery = "SELECT id FROM customers WHERE email = '$email'";
        $result = $conn->query($checkEmailQuery);

        if ($result->num_rows > 0) {
            $response = array("status" => "error", "message" => "Email already exists");
            echo json_encode($response);
            exit;
        }

        // Hash the password before storing
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        // Insert new customer record
        $sql = "INSERT INTO customers (nic, customer_name, address, phone_no, email, password)
                VALUES ('$nic', '$customer_name', '$address', '$phone_no', '$email', '$hashedPassword')";

        // Check if insertion was successful
        if ($conn->query($sql) === TRUE) {
            $customer_id = $conn->insert_id;

            $sql = "SELECT id, nic, customer_name, address, phone_no, email FROM customers WHERE id = $customer_id";
            $result = $conn->query($sql);

            if ($result->num_rows > 0) {
                $customer_details = $result->fetch_assoc();
                $response = array("status" => "success", "message" => "Customer registered successfully", "customer" => $customer_details);
            } else {
                $response = array("status" => "error", "message" => "Customer added but unable to fetch details");
            }
        } else {
            $response = array("status" => "error", "message" => "Error: " . $conn->error);
        }

        echo json_encode($response);
        exit;
    } elseif ($action == "login") {
        // Login Process
        $email = $conn->real_escape_string($data->email);
        $password = $conn->real_escape_string($data->password);

        // Validate required fields
        if (empty($email) || empty($password)) {
            $response = array("status" => "error", "message" => "Email and password are required");
            echo json_encode($response);
            exit;
        }

        // Validate email format
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $response = array("status" => "error", "message" => "Invalid email format");
            echo json_encode($response);
            exit;
        }

        // Check if customer exists with the given email
        $sql = "SELECT id, nic, customer_name, address, phone_no, email, password FROM customers WHERE email = '$email'";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            $customer = $result->fetch_assoc();

            // Verify the password
            if (password_verify($password, $customer['password'])) {
                unset($customer['password']); // Remove password from response
                $response = array("status" => "success", "message" => "Login successful", "customer" => $customer);
            } else {
                $response = array("status" => "error", "message" => "Invalid password");
            }
        } else {
            $response = array("status" => "error", "message" => "Email not found");
        }

        echo json_encode($response);
        exit;
    } else {
        // Invalid action
        $response = array("status" => "error", "message" => "Invalid action");
        echo json_encode($response);
        exit;
    }
}

// Close connection
$conn->close();
?>
