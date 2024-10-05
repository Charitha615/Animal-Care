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
$dbname = "animal_care"; 

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
        $email = $conn->real_escape_string($data->email);
        $password = $conn->real_escape_string($data->password);
        $full_name = $conn->real_escape_string($data->full_name);
        $gender = $conn->real_escape_string($data->gender);
        $date_of_birth = $conn->real_escape_string($data->date_of_birth);
        $phone_number = $conn->real_escape_string($data->phone_number);
        $medical_license_number = $conn->real_escape_string($data->medical_license_number);
        $specialization = $conn->real_escape_string($data->specialization);
        $years_of_experience = $conn->real_escape_string($data->years_of_experience);
        $qualifications = $conn->real_escape_string($data->qualifications);

        // Validate required fields
        if (empty($email) || empty($password) || empty($full_name) || empty($gender) || empty($date_of_birth) || empty($phone_number) || empty($medical_license_number) || empty($specialization) || empty($years_of_experience) || empty($qualifications)) {
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

        // Check if email or license number already exists
        $checkQuery = "SELECT id FROM doctors WHERE email = '$email' OR medical_license_number = '$medical_license_number'";
        $result = $conn->query($checkQuery);

        if ($result->num_rows > 0) {
            $response = array("status" => "error", "message" => "Email or Medical License Number already exists");
            echo json_encode($response);
            exit;
        }

        // Hash the password before storing
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        // Insert new doctor record
        $sql = "INSERT INTO doctors (email, password, full_name, gender, date_of_birth, phone_number, medical_license_number, specialization, years_of_experience, qualifications)
                VALUES ('$email', '$hashedPassword', '$full_name', '$gender', '$date_of_birth', '$phone_number', '$medical_license_number', '$specialization', '$years_of_experience', '$qualifications')";

        // Check if insertion was successful
        if ($conn->query($sql) === TRUE) {
            $doctor_id = $conn->insert_id;

            $sql = "SELECT id, email, full_name, gender, date_of_birth, phone_number, medical_license_number, specialization, years_of_experience, qualifications FROM doctors WHERE id = $doctor_id";
            $result = $conn->query($sql);

            if ($result->num_rows > 0) {
                $doctor_details = $result->fetch_assoc();
                $response = array("status" => "success", "message" => "Doctor registered successfully", "doctor" => $doctor_details);
            } else {
                $response = array("status" => "error", "message" => "Doctor added but unable to fetch details");
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

        // Check if doctor exists with the given email
        $sql = "SELECT id, email, full_name, gender, date_of_birth, phone_number, medical_license_number, specialization, years_of_experience, qualifications, password FROM doctors WHERE email = '$email'";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            $doctor = $result->fetch_assoc();

            // Verify the password
            if (password_verify($password, $doctor['password'])) {
                unset($doctor['password']); // Remove password from response
                $response = array("status" => "success", "message" => "Login successful", "doctor" => $doctor);
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
