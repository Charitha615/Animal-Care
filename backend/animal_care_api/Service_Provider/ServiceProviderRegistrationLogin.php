<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight (OPTIONS) request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$servername = "localhost";
$username = "root"; // Default username for WAMP/MAMP
$password = ""; // Default password is empty
$dbname = "animal_care"; // Your database name

// Create connection to MySQL
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Handle form-data and JSON input
    $contentType = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';

    if ($contentType === "application/json") {
        // Handle JSON input
        $input = json_decode(file_get_contents("php://input"), true);
        if ($input === null) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid JSON input']);
            exit;
        }
        $_POST = $input;
    }

    $action = $_POST['action'] ?? '';

    if ($action === 'register') {
        registerServiceProvider();
    } elseif ($action === 'login') {
        loginServiceProvider();
    } else {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
    }
} else {
    http_response_code(405); // Method not allowed
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}

function registerServiceProvider() {
    global $conn;

    // Sanitize inputs
    $serviceCenterName = $conn->real_escape_string($_POST['service_center_name']);
    $ownerName = $conn->real_escape_string($_POST['owner_name']);
    $location = $conn->real_escape_string($_POST['location']);
    $phoneNo = $conn->real_escape_string($_POST['phone_no']);
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $nic = $conn->real_escape_string($_POST['nic']);
    $serviceTypes = $_POST['service_types']; // JSON string
    $password = $_POST['password'];

    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid email address']);
        return;
    }

    // Handle file upload
    $imagePath = null;
    if (isset($_FILES['image'])) {
        $targetDir = "uploads/";
        $imageName = basename($_FILES["image"]["name"]);
        
        // Replace spaces with underscores
        $imageName = str_replace(' ', '_', $imageName);
        $imagePath = $targetDir . $imageName;

        // Validate file type (for example, only allow jpg, png, jpeg)
        $fileType = strtolower(pathinfo($imagePath, PATHINFO_EXTENSION));
        $allowedTypes = ['jpg', 'jpeg', 'png'];
        if (!in_array($fileType, $allowedTypes)) {
            echo json_encode(['status' => 'error', 'message' => 'Invalid image format. Allowed formats: jpg, jpeg, png']);
            return;
        }

        if (!move_uploaded_file($_FILES["image"]["tmp_name"], $imagePath)) {
            echo json_encode(['status' => 'error', 'message' => 'Failed to upload image']);
            return;
        }
    }

    // Check if email already exists
    $stmt = $conn->prepare("SELECT * FROM service_providers WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        http_response_code(409); // Conflict
        echo json_encode(['status' => 'error', 'message' => 'Email already registered']);
        return;
    }

    // Hash the password
    $passwordHash = password_hash($password, PASSWORD_BCRYPT);

    // Insert new service provider into the database
    $stmt = $conn->prepare("INSERT INTO service_providers (service_center_name, owner_name, location, phone_no, email, nic, image, service_types, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssssssss", $serviceCenterName, $ownerName, $location, $phoneNo, $email, $nic, $imagePath, $serviceTypes, $passwordHash);

    if ($stmt->execute()) {
        http_response_code(201); // Created
        echo json_encode(['status' => 'success', 'message' => 'Service Provider registered successfully']);
    } else {
        http_response_code(500); // Internal Server Error
        echo json_encode(['status' => 'error', 'message' => 'Registration failed']);
    }

    $stmt->close();
}


function loginServiceProvider() {
    global $conn;

    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $password = $_POST['password'];

    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid email address']);
        return;
    }

    // Check if the email exists
    $stmt = $conn->prepare("SELECT * FROM service_providers WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();

        // Verify password
        if (password_verify($password, $row['password_hash'])) {
            http_response_code(200);
            echo json_encode([
                'status' => 'success',
                'message' => 'Login successful',
                'data' => [
                    'id' => $row['id'],
                    'service_center_name' => $row['service_center_name'],
                    'owner_name' => $row['owner_name'],
                    'location' => $row['location'],
                    'phone_no' => $row['phone_no'],
                    'email' => $row['email'],
                    'nic' => $row['nic'],
                    'image' => $row['image'],
                    'service_types' => json_decode($row['service_types']),
                ]
            ]);
        } else {
            http_response_code(401); // Unauthorized
            echo json_encode(['status' => 'error', 'message' => 'Invalid password']);
        }
    } else {
        http_response_code(404); // Not Found
        echo json_encode(['status' => 'error', 'message' => 'Email not registered']);
    }

    $stmt->close();
}
