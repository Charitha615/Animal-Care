<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
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

// Check if the request method is POST for pet registration with vaccination details
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $petName = $_POST['petName'] ?? '';
    $breed = $_POST['breed'] ?? '';
    $age = intval($_POST['age'] ?? 0);
    $user_id = intval($_POST['user_id'] ?? 0);
    $imagePath = '';

    // Handle file upload
    if (isset($_FILES['petImage']) && $_FILES['petImage']['error'] == UPLOAD_ERR_OK) {
        $targetDir = "uploads/";
        if (!is_dir($targetDir)) {
            mkdir($targetDir, 0777, true);
        }
        $targetFile = $targetDir . basename($_FILES['petImage']['name']);
        if (move_uploaded_file($_FILES['petImage']['tmp_name'], $targetFile)) {
            $imagePath = $targetFile;
        } else {
            http_response_code(500);
            echo json_encode(array("status" => "error", "message" => "Failed to upload image"));
            exit;
        }
    }

    $conn->begin_transaction();

    try {
        // Insert the pet data into the pets table
        $stmt = $conn->prepare("INSERT INTO pets (pet_name, breed, age, image_path,user_id) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("ssisi", $petName, $breed, $age, $imagePath, $user_id);

        if (!$stmt->execute()) {
            throw new Exception("Failed to register pet");
        }

        $petId = $stmt->insert_id;
        $stmt->close();

        // Handle multiple vaccination details
        $vaccinationDetails = json_decode($_POST['vaccinationDetails'], true);
        if (!empty($vaccinationDetails)) {
            $stmt = $conn->prepare("INSERT INTO vaccinations (pet_id, vaccination_name, vaccination_date) VALUES (?, ?, ?)");
            foreach ($vaccinationDetails as $detail) {
                $vaccinationName = $detail['vaccinationName'];
                $vaccinationDate = $detail['vaccinationDate'];
                $stmt->bind_param("iss", $petId, $vaccinationName, $vaccinationDate);

                if (!$stmt->execute()) {
                    throw new Exception("Failed to add vaccination details");
                }
            }
            $stmt->close();
        }

        $conn->commit();
        http_response_code(201);
        echo json_encode(array("status" => "success", "message" => "Pet registered successfully with vaccination details"));
    } catch (Exception $e) {
        $conn->rollback();
        http_response_code(500);
        echo json_encode(array("status" => "error", "message" => $e->getMessage()));
    }
}

$conn->close();
?>
