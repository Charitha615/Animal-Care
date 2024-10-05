<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
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

// Check if the request method is GET for fetching details by serviceProviderId
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    // Get the serviceProviderId from query parameters
    if (isset($_GET['serviceProviderId']) && !empty($_GET['serviceProviderId'])) {
        $serviceProviderId = intval($_GET['serviceProviderId']); // Sanitize input

        // Prepare the SQL query to fetch service provider details
        $stmt = $conn->prepare("SELECT * FROM appointments WHERE service_provider_id = ?");
        $stmt->bind_param("i", $serviceProviderId);

        if ($stmt->execute()) {
            $result = $stmt->get_result();
            if ($result->num_rows > 0) {
                // Fetch and return the service provider's details
                $providerDetails = $result->fetch_assoc();
                echo json_encode(array("status" => "success", "data" => $providerDetails));
            } else {
                http_response_code(404);
                echo json_encode(array("status" => "error", "message" => "Service provider not found"));
            }
        } else {
            http_response_code(500);
            echo json_encode(array("status" => "error", "message" => "Failed to fetch service provider details"));
        }

        $stmt->close();
    } else {
        http_response_code(400);
        echo json_encode(array("status" => "error", "message" => "Missing or invalid serviceProviderId"));
    }
}

// Check if the request method is POST for booking an appointment
elseif ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Get the input data from the request
    $data = json_decode(file_get_contents("php://input"), true);

    // Check if all required fields are provided
    if (
        !empty($data['customerName']) &&
        !empty($data['petType']) &&
        !empty($data['petName']) &&
        !empty($data['serviceType']) &&
        !empty($data['date']) &&
        !empty($data['time']) &&
        !empty($data['serviceProviderId']) && // Ensure serviceProviderId is provided
        !empty($data['user_id']) // Ensure userId is provided
    ) {
        // Prepare the SQL query to insert the appointment into the database
        $stmt = $conn->prepare("INSERT INTO appointments (customer_name, pet_type, pet_name, service_type, appointment_date, appointment_time, service_provider_id, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param(
            "ssssssii",
            $data['customerName'],
            $data['petType'],
            $data['petName'],
            implode(", ", $data['serviceType']), // Multiple service types
            $data['date'],
            $data['time'],
            $data['serviceProviderId'], // Bind the serviceProviderId to the query
            $data['user_id'] // Bind the userId to the query
        );

        // Execute the query and check if successful
        if ($stmt->execute()) {
            echo json_encode(array("status" => "success", "message" => "Appointment booked successfully"));
        } else {
            http_response_code(500);
            echo json_encode(array("status" => "error", "message" => "Failed to book appointment"));
        }

        $stmt->close();
    } else {
        // If any required field is missing, return an error
        http_response_code(400);
        echo json_encode(array("status" => "error", "message" => "All fields are required"));
    }
} else {
    // If request method is not POST or GET, return an error
    http_response_code(405);
    echo json_encode(array("status" => "error", "message" => "Method not allowed"));
}

$conn->close();
?>
