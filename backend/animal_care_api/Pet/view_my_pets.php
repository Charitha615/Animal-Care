<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
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

// Get the UserID from query parameters or request data
$userID = isset($_GET['UserID']) ? intval($_GET['UserID']) : 0;

if ($userID === 0) {
    http_response_code(400);
    echo json_encode(array("status" => "error", "message" => "Invalid UserID"));
    exit;
}

// Fetch all pets associated with the UserID and their vaccination details
try {
    $petsQuery = "SELECT * FROM pets WHERE user_id = $userID";
    $petsResult = $conn->query($petsQuery);
    $pets = [];

    while ($pet = $petsResult->fetch_assoc()) {
        $petId = $pet['id'];

        // Fetch vaccinations for each pet
        $vaccinationsQuery = "SELECT id ,vaccination_name, vaccination_date, status FROM vaccinations WHERE pet_id = $petId";
        $vaccinationsResult = $conn->query($vaccinationsQuery);

        $vaccinations = [];
        while ($vaccination = $vaccinationsResult->fetch_assoc()) {
            $vaccinations[] = $vaccination;
        }

        // Add pet data along with its vaccinations
        $pet['vaccinations'] = $vaccinations;
        $pets[] = $pet;
    }

    http_response_code(200);
    echo json_encode(array("status" => "success", "data" => $pets));
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("status" => "error", "message" => $e->getMessage()));
}

$conn->close();
?>
