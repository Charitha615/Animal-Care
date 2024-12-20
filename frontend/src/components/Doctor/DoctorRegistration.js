import React, {useState} from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../Customer/Registration.css';
import config from '../../config';

const DoctorRegistration = () => {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        gender: '',
        date_of_birth: '',
        phone_number: '',
        medical_license_number: '',
        specialization: '',
        years_of_experience: '',
        qualifications: '',
        profile_image: null // New field for profile image
    });

    const handleChange = (e) => {
        if (e.target.name === 'profile_image') {
            // Handling file input
            let file = e.target.files[0];
            if (file) {
                // Remove spaces from the file name
                const renamedFile = new File(
                    [file],
                    file.name.replace(/\s+/g, '_'),
                    {type: file.type}
                );
                setFormData({
                    ...formData,
                    profile_image: renamedFile
                });
            }
        } else {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Initialize an empty errors object
        const newErrors = {};

        // Regular Expressions for validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phoneRegex = /^(07\d{8})$/;  // Update if different pattern is required
        const licenseRegex = /^[A-Za-z0-9]{6,}$/;  // Basic license number validation

        // Validate each field
        if (!formData.email || !emailRegex.test(formData.email)) {
            newErrors.email = "Invalid email format.";
        }

        if (!formData.phone_number || !phoneRegex.test(formData.phone_number)) {
            newErrors.phone_number = "Phone number must start with '07' and contain 9 digits.";
        }

        if (!formData.medical_license_number || !licenseRegex.test(formData.medical_license_number)) {
            newErrors.medical_license_number = "Medical license number is required and should be at least 6 alphanumeric characters.";
        }

        // Additional required field checks
        if (!formData.full_name) {
            newErrors.full_name = "Full name is required.";
        }
        if (!formData.gender) {
            newErrors.gender = "Gender is required.";
        }
        if (!formData.date_of_birth) {
            newErrors.date_of_birth = "Date of birth is required.";
        }
        if (!formData.specialization) {
            newErrors.specialization = "Specialization is required.";
        }
        if (!formData.years_of_experience || isNaN(formData.years_of_experience)) {
            newErrors.years_of_experience = "Years of experience is required and must be a number.";
        }
        if (!formData.qualifications) {
            newErrors.qualifications = "Qualifications are required.";
        }

        // If there are any validation errors, show them and stop submission
        if (Object.keys(newErrors).length > 0) {
            Swal.fire('Validation Error', Object.values(newErrors).join('<br>'), 'error');
            return; // Stop execution if validation fails
        }

        // Creating a FormData object to send form data and the image
        const submissionData = new FormData();
        submissionData.append('action', 'register');
        submissionData.append('email', formData.email);
        submissionData.append('password', formData.password);
        submissionData.append('full_name', formData.full_name);
        submissionData.append('gender', formData.gender);
        submissionData.append('date_of_birth', formData.date_of_birth);
        submissionData.append('phone_number', formData.phone_number);
        submissionData.append('medical_license_number', formData.medical_license_number);
        submissionData.append('specialization', formData.specialization);
        submissionData.append('years_of_experience', parseInt(formData.years_of_experience, 10));
        submissionData.append('qualifications', formData.qualifications);

        // Adding the profile image to the submission data if it exists
        if (formData.profile_image) {
            submissionData.append('profile_image', formData.profile_image);
        }

        // Send the validated data to the server
        axios.post(`${config.API_BASE_URL}/Doctor/DoctorfRegistrationLogin.php`, submissionData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then((response) => {
                console.log("Response:", response);

                if (response.data.status === 'success') {
                    Swal.fire('Success', 'Doctor registered successfully', 'success');
                    setTimeout(() => {
                        window.location.href = "/login";
                    }, 2500);
                } else {
                    Swal.fire('Error', response.data.message || 'Registration failed');
                }
            })
            .catch((error) => {
                if (error.response) {
                    console.error("Server responded with an error:", error.response.data);
                    Swal.fire('Error', error.response.data.message || 'A server-side error occurred', 'error');
                } else if (error.request) {
                    console.error("No response received from server:", error.request);
                    Swal.fire('Error', 'No response received from the server. Please try again later.', 'error');
                } else {
                    console.error("Error setting up the request:", error.message);
                    Swal.fire('Error', 'An unexpected error occurred: ' + error.message, 'error');
                }
            });
    };


    return (
        <div className="registration-container">
            <div className="image-container">
                <img src="https://www.eylulveterinerlik.com/upload/galeri/boluveteriner.jpg" alt="Dog and Cat"/>
            </div>

            <div className="form-container">
                <strong><h2 className="text-center mb-4">Doctor Registration</h2></strong>
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <label>Full Name:</label>
                        <input
                            type="text"
                            className="form-control"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label>Email:</label>
                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label>Password:</label>
                        <input
                            type="password"
                            className="form-control"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label>Gender:</label>
                        <select
                            className="form-control"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                    <div className="form-group mb-3">
                        <label>Date of Birth:</label>
                        <input
                            type="date"
                            className="form-control"
                            name="date_of_birth"
                            value={formData.date_of_birth}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label>Phone Number:</label>
                        <input
                            type="text"
                            className="form-control"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label>Medical License Number:</label>
                        <input
                            type="text"
                            className="form-control"
                            name="medical_license_number"
                            value={formData.medical_license_number}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label>Specialization:</label>
                        <input
                            type="text"
                            className="form-control"
                            name="specialization"
                            value={formData.specialization}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label>Years of Experience:</label>
                        <input
                            type="number"
                            className="form-control"
                            name="years_of_experience"
                            value={formData.years_of_experience}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label>Qualifications:</label>
                        <input
                            type="text"
                            className="form-control"
                            name="qualifications"
                            value={formData.qualifications}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label>Profile Image:</label>
                        <input
                            type="file"
                            className="form-control"
                            name="profile_image"
                            accept="image/*"
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="btn btn-success w-100">Register</button>
                </form>
                <p className="text-center mt-3">
                    Already have an account? <a href="/login">Login</a>
                </p>
            </div>
        </div>
    );
};

export default DoctorRegistration;
