import React, {useState} from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Registration.css';
import config from '../../config';

const Registration = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        nic: '',
        address: '',
        phoneNumber: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Initialize an empty errors object
        const newErrors = {};

        // Regular Expressions for validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phoneRegex = /^(07\d{8})$/;
        const nicRegex = /^(\d{9}[VXvx]|\d{12})$/;

        // Validate each field
        if (!emailRegex.test(formData.email)) {
            newErrors.email = "Invalid email format.";
        }

        if (!phoneRegex.test(formData.phoneNumber)) {
            newErrors.phoneNumber = "Phone number must start with '07' and contain 9 digits.";
        }

        if (!nicRegex.test(formData.nic)) {
            newErrors.nic = "NIC should be either 10 characters (9 digits + V/X) or 12 digits.";
        }

        // Additional required field checks
        if (!formData.username) {
            newErrors.username = "Username is required.";
        }
        if (!formData.address) {
            newErrors.address = "Address is required.";
        }
        if (!formData.password) {
            newErrors.password = "Password is required.";
        }

        // If there are any validation errors, show them and stop submission
        if (Object.keys(newErrors).length > 0) {
            // Display error messages using Swal
            Swal.fire('Validation Error', Object.values(newErrors).join('<br>'), 'error');
            return; // Stop execution if validation fails
        }

        // If all fields are valid, proceed with the API call
        axios.post(`${config.API_BASE_URL}/Customer/CustomerRegistrationLogin.php`, {
            action: 'register',
            nic: formData.nic,
            customer_name: formData.username,
            address: formData.address,
            phone_no: formData.phoneNumber,
            email: formData.email,
            password: formData.password,
        })
            .then((response) => {
                console.log("res is", response);

                // Check if the request was successful
                if (response.data.status === 'success') {
                    Swal.fire('Success', 'Customer registered successfully', 'success');
                    setTimeout(() => {
                        window.location.href = "/login";
                    }, 2500);
                } else {
                    // Show the error message from the server response
                    Swal.fire('Error', response.data.message || 'Registration failed');
                }
            })
            .catch((error) => {
                // Handle specific server-side or client-side errors
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
            {/* Left side with image */}
            <div className="image-container">
                <img src="https://www.eylulveterinerlik.com/upload/galeri/boluveteriner.jpg" alt="Dog and Cat"/>
            </div>

            {/* Right side with form */}
            <div className="form-container">
                <strong><h2 className="text-center mb-4">Customer Registration </h2></strong>
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <label>Username:</label>
                        <input type="text" className="form-control" name="username" value={formData.username}
                               onChange={handleChange} required/>
                    </div>
                    <div className="form-group mb-3">
                        <label>Email:</label>
                        <input type="email" className="form-control" name="email" value={formData.email}
                               onChange={handleChange} required/>
                    </div>
                    <div className="form-group mb-3">
                        <label>National ID:</label>
                        <input type="text" className="form-control" name="nic" value={formData.nic}
                               onChange={handleChange} required/>
                    </div>
                    <div className="form-group mb-3">
                        <label>Address:</label>
                        <input type="text" className="form-control" name="address" value={formData.address}
                               onChange={handleChange} required/>
                    </div>
                    <div className="form-group mb-3">
                        <label>Phone Number:</label>
                        <input type="text" className="form-control" name="phoneNumber" value={formData.phoneNumber}
                               onChange={handleChange} required/>
                    </div>
                    <div className="form-group mb-3">
                        <label>Password:</label>
                        <input type="password" className="form-control" name="password" value={formData.password}
                               onChange={handleChange} required/>
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

export default Registration;
