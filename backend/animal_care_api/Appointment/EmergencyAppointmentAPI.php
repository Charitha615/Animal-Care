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

// Handle POST request
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    try {
        // Decode JSON data from request
        $data = json_decode(file_get_contents("php://input"));

        if (!isset($data->action)) {
            throw new Exception("Action is required");
        }

        $action = $conn->real_escape_string($data->action);

        // Emergency Appointment registration
        if ($action == "register_emergency_appointment") {
            $user_id = $conn->real_escape_string($data->user_id);
            $appointment_time = $conn->real_escape_string($data->appointment_time);
            $google_meeting_link = $conn->real_escape_string($data->google_meeting_link);
            $gender = $conn->real_escape_string($data->gender);
            $doctor_id = $conn->real_escape_string($data->doctor_id);
            $payment_status = $conn->real_escape_string($data->payment_status);
            $status = $conn->real_escape_string($data->status);

            // Fetch customer_name using user_id from the customers table
            $result = $conn->query("SELECT customer_name FROM customers WHERE id = '$user_id'");
            if ($result->num_rows == 0) {
                throw new Exception("User not found");
            }
            $row = $result->fetch_assoc();
            $customer_name = $conn->real_escape_string($row['customer_name']);

            // Insert the emergency appointment data into the table
            $sql = "INSERT INTO emergency_appointments (user_id, customer_name, appointment_time, google_meeting_link, gender, doctor_id, payment_status,status)
        VALUES ('$user_id', '$customer_name', '$appointment_time', '$google_meeting_link', '$gender', '$doctor_id', '$payment_status','$status')";


            if ($conn->query($sql) === TRUE) {
                echo json_encode(array("status" => "success", "message" => "Emergency appointment registered successfully"));
            } else {
                throw new Exception("Error: " . $conn->error);
            }
        }

        // Get emergency appointments by user_id
        if ($action == "get_emergency_appointments_by_user") {
            if (!isset($data->user_id)) {
                throw new Exception("UserID is required");
            }

            $user_id = $conn->real_escape_string($data->user_id);

            // Query to get appointments by user_id
            $sql = "SELECT * FROM emergency_appointments WHERE user_id = '$user_id'";
            $result = $conn->query($sql);

            if ($result->num_rows > 0) {
                $appointments = array();
                while ($row = $result->fetch_assoc()) {
                    $appointments[] = $row;
                }
                echo json_encode(array("status" => "success", "data" => $appointments));
            } else {
                echo json_encode(array("status" => "success", "data" => [], "message" => "No appointments found"));
            }
        }

        // Get emergency appointments by doctor_id
        if ($action == "get_emergency_appointments_by_doctor") {
            if (!isset($data->doctor_id)) {
                throw new Exception("DoctorID is required");
            }

            $doctor_id = $conn->real_escape_string($data->doctor_id);

            // Query to get appointments by doctor_id
            $sql = "SELECT * FROM emergency_appointments WHERE doctor_id = '$doctor_id' AND status = 'NotDone'";
            $result = $conn->query($sql);

            if ($result->num_rows > 0) {
                $appointments = array();
                while ($row = $result->fetch_assoc()) {
                    $appointments[] = $row;
                }
                echo json_encode(array("status" => "success", "data" => $appointments));
            } else {
                echo json_encode(array("status" => "success", "data" => [], "message" => "No appointments found for this doctor"));
            }
        }

        

        if ($action == "update_appointment_status") {
            if (!isset($data->appointment_id) || !isset($data->status)) {
                throw new Exception("Appointment ID and status are required");
            }

            $appointment_id = $conn->real_escape_string($data->appointment_id);
            $status = $conn->real_escape_string($data->status);

            // Update the appointment status in the database
            $sql = "UPDATE emergency_appointments SET status = '$status' WHERE id = '$appointment_id'";

            if ($conn->query($sql) === TRUE) {
                echo json_encode(array("status" => "success", "message" => "Appointment status updated successfully"));
            } else {
                throw new Exception("Error updating status: " . $conn->error);
            }
        }

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(array("status" => "error", "message" => $e->getMessage()));
    }
}
