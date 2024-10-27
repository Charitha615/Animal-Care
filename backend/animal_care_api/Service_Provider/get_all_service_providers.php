<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
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

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['id'])) {
        getServiceProviderById($_GET['id']);
    } else {
        getAllServiceProviders();
    }
} else {
    http_response_code(405); // Method not allowed
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}

function getAllServiceProviders() {
    global $conn;

    // Fetch all service providers
    $sql = "SELECT id, service_center_name, owner_name, location, phone_no, email, nic, image, service_types FROM service_providers";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $serviceProviders = [];

        // Fetch data into an array
        while ($row = $result->fetch_assoc()) {
            $serviceProviders[] = [
                'id' => $row['id'],
                'service_center_name' => $row['service_center_name'],
                'owner_name' => $row['owner_name'],
                'location' => $row['location'],
                'phone_no' => $row['phone_no'],
                'email' => $row['email'],
                'nic' => $row['nic'],
                'image' => $row['image'],
                'service_types' => json_decode($row['service_types']) // Assuming service_types is stored as JSON in the database
            ];
        }

        // Respond with the list of service providers
        http_response_code(200); // Success
        echo json_encode(['status' => 'success', 'data' => $serviceProviders]);
    } else {
        http_response_code(404); // No service providers found
        echo json_encode(['status' => 'error', 'message' => 'No service providers found']);
    }
}

function getServiceProviderById($id) {
    global $conn;

    // Fetch service provider by ID
    $sql = "SELECT id, service_center_name, owner_name, location, phone_no, email, nic, image, service_types FROM service_providers WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $serviceProvider = $result->fetch_assoc();
        $serviceProvider['service_types'] = json_decode($serviceProvider['service_types']); // Decode JSON

        // Respond with the service provider data
        http_response_code(200); // Success
        echo json_encode(['status' => 'success', 'data' => $serviceProvider]);
    } else {
        http_response_code(404); // No service provider found
        echo json_encode(['status' => 'error', 'message' => 'Service provider not foundss']);
    }

    $stmt->close();
}

$conn->close();
?>
