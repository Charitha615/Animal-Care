import React, {useState} from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Select from 'react-select'; // Import react-select
import '../Customer/Registration.css';
import config from '../../config';

const ServiceProviderRegistration = () => {
    const [formData, setFormData] = useState({
        service_center_name: '',
        owner_name: '',
        location: '',
        phone_no: '',
        email: '',
        password: '',
        nic: '',
        image: null,
        service_types: [] // Updated for react-select
    });

    const serviceOptions = [
        {value: 'Vaccinations', label: 'Vaccinations'},
        {value: 'General Health check-ups', label: 'General Health check-ups'},
        {value: 'Doctor channeling', label: 'Doctor channeling'},
        {value: 'Grooming', label: 'Grooming'},
        {value: 'Scanning', label: 'Scanning'},
        {value: 'X-ray', label: 'X-ray'},
        {value: 'ECG', label: 'ECG'},
        {value: 'Tick & Flea treatments', label: 'Tick & Flea treatments'},
        {value: 'Shampoo bath', label: 'Shampoo bath'},
        {value: 'Tick bath', label: 'Tick bath'},
        {value: 'Medicated Bath', label: 'Medicated Bath'},
        {value: 'Pet boarding', label: 'Pet boarding'},
        {value: 'Training classes', label: 'Training classes'}
    ];

    const handleChange = (e) => {
        const {name, value, type} = e.target;
        if (type === 'file') {
            setFormData({...formData, [name]: e.target.files[0]});
        } else {
            setFormData({...formData, [name]: value});
        }
    };

    const handleServiceTypeChange = (selectedOptions) => {
        const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setFormData({...formData, service_types: selectedValues});
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
        if (!formData.email || !emailRegex.test(formData.email)) {
            newErrors.email = "Invalid email format.";
        }

        if (!formData.phone_no || !phoneRegex.test(formData.phone_no)) {
            newErrors.phone_no = "Phone number must start with '07' and contain 9 digits.";
        }

        if (!formData.nic || !nicRegex.test(formData.nic)) {
            newErrors.nic = "NIC should be either 10 characters (9 digits + V/X) or 12 digits.";
        }

        // Additional required field checks
        if (!formData.service_center_name) {
            newErrors.service_center_name = "Service center name is required.";
        }
        if (!formData.owner_name) {
            newErrors.owner_name = "Owner name is required.";
        }
        if (!formData.location) {
            newErrors.location = "Location is required.";
        }
        if (!formData.password) {
            newErrors.password = "Password is required.";
        }
        if (!formData.image) {
            newErrors.image = "Please upload an image.";
        }
        if (!formData.service_types || formData.service_types.length === 0) {
            newErrors.service_types = "At least one service type must be selected.";
        }

        // If there are any validation errors, show them and stop submission
        if (Object.keys(newErrors).length > 0) {
            Swal.fire('Validation Error', Object.values(newErrors).join('<br>'), 'error');
            return; // Stop execution if validation fails
        }

        // Proceed with form submission if all validations pass
        const data = new FormData();
        data.append('action', 'register');
        data.append('service_center_name', formData.service_center_name);
        data.append('owner_name', formData.owner_name);
        data.append('location', formData.location);
        data.append('phone_no', formData.phone_no);
        data.append('email', formData.email);
        data.append('password', formData.password);
        data.append('nic', formData.nic);
        data.append('image', formData.image);
        data.append('service_types', JSON.stringify(formData.service_types));

        // Log the form data for debugging
        const formObject = Object.fromEntries(data.entries());
        console.log('Form Data Object:', formObject);

        // Perform the API request
        axios
            .post(`${config.API_BASE_URL}/Service_Provider/ServiceProviderRegistrationLogin.php`, data)
            .then((response) => {
                console.log('Response:', response);

                if (response.status === 201) {
                    Swal.fire('Success', 'Service Provider registered successfully', 'success');
                    setTimeout(() => {
                        window.location.href = "/login";
                    }, 2500);
                } else {
                    Swal.fire('Error', response.data.message || 'Registration failed');
                }
            })
            .catch((error) => {
                if (error.response) {
                    console.error('Server responded with an error:', error.response.data);
                    Swal.fire('Error', error.response.data.message || 'A server-side error occurred', 'error');
                } else if (error.request) {
                    console.error('No response received from server:', error.request);
                    Swal.fire('Error', 'No response received from the server. Please try again later.', 'error');
                } else {
                    console.error('Error setting up the request:', error.message);
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
                <strong><h2 className="text-center mb-4">Service Provider Registration</h2></strong>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="form-group mb-3">
                        <label>Service Center Name:</label>
                        <input
                            type="text"
                            className="form-control"
                            name="service_center_name"
                            value={formData.service_center_name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label>Owner Name:</label>
                        <input
                            type="text"
                            className="form-control"
                            name="owner_name"
                            value={formData.owner_name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label>Location:</label>
                        <input
                            type="text"
                            className="form-control"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label>Phone Number:</label>
                        <input
                            type="text"
                            className="form-control"
                            name="phone_no"
                            value={formData.phone_no}
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
                        <label>NIC:</label>
                        <input
                            type="text"
                            className="form-control"
                            name="nic"
                            value={formData.nic}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label>Service Types (Select multiple):</label>
                        <Select
                            isMulti
                            options={serviceOptions}
                            onChange={handleServiceTypeChange}
                            value={serviceOptions.filter(option => formData.service_types.includes(option.value))}
                            className="basic-multi-select"
                            classNamePrefix="select"
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label>Upload Image:</label>
                        <input
                            type="file"
                            className="form-control"
                            name="image"
                            onChange={handleChange}
                            required
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

export default ServiceProviderRegistration;
