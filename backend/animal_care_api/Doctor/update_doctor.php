<?php

// CORS headers to allow cross-origin requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight (OPTIONS) request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Include DB connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "animal_care";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if the request method is PUT or POST
if ($_SERVER['REQUEST_METHOD'] == 'POST' || $_SERVER['REQUEST_METHOD'] == 'PUT') {
    // Use $_POST for form-data
    if (isset($_POST['doctor_id'])) {
        $doctor_id = $conn->real_escape_string($_POST['doctor_id']);
        
        // Fields to update
        $fields = [];
        if (!empty($_POST['email'])) $fields[] = "email='" . $conn->real_escape_string($_POST['email']) . "'";
        if (!empty($_POST['full_name'])) $fields[] = "full_name='" . $conn->real_escape_string($_POST['full_name']) . "'";
        if (!empty($_POST['gender'])) $fields[] = "gender='" . $conn->real_escape_string($_POST['gender']) . "'";
        if (!empty($_POST['date_of_birth'])) $fields[] = "date_of_birth='" . $conn->real_escape_string($_POST['date_of_birth']) . "'";
        if (!empty($_POST['phone_number'])) $fields[] = "phone_number='" . $conn->real_escape_string($_POST['phone_number']) . "'";
        if (!empty($_POST['medical_license_number'])) $fields[] = "medical_license_number='" . $conn->real_escape_string($_POST['medical_license_number']) . "'";
        if (!empty($_POST['specialization'])) $fields[] = "specialization='" . $conn->real_escape_string($_POST['specialization']) . "'";
        
        // Profile image upload handling
        if (isset($_FILES['profile_image']) && $_FILES['profile_image']['error'] == 0) {
            $imageFile = $_FILES['profile_image'];
            $imageName = time() . '_' . preg_replace('/\s+/', '_', basename($imageFile['name']));
            $targetDir = "uploads/doctor_images/";
            $targetFilePath = $targetDir . $imageName;

            // Create directory if it doesn't exist
            if (!is_dir($targetDir)) {
                mkdir($targetDir, 0777, true);
            }

            // Move the uploaded file to the target directory
            if (move_uploaded_file($imageFile['tmp_name'], $targetFilePath)) {
                $fields[] = "profile_image='" . $conn->real_escape_string($targetFilePath) . "'";
            } else {
                echo json_encode(array("status" => "error", "message" => "Failed to upload profile image"));
                exit;
            }
        }

        // Proceed only if there are fields to update
        if (count($fields) > 0) {
            $sql = "UPDATE doctors SET " . implode(', ', $fields) . " WHERE id='$doctor_id'";
            
            if ($conn->query($sql) === TRUE) {
                echo json_encode(array("status" => "success", "message" => "Doctor profile updated successfully"));
            } else {
                echo json_encode(array("status" => "error", "message" => "Error updating doctor profile"));
            }
        } else {
            echo json_encode(array("status" => "error", "message" => "No data provided for update"));
        }
    } else {
        echo json_encode(array("status" => "error", "message" => "Doctor ID is required"));
    }
}

$conn->close();
?>
