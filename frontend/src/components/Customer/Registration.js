import React, { useState } from 'react';
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
        // The request was made and the server responded with a status code outside of the range of 2xx
        console.error("Server responded with an error:", error.response.data);
        Swal.fire('Error', error.response.data.message || 'A server-side error occurred', 'error');
      } else if (error.request) {
        // The request was made but no response was received (e.g., network error or CORS issue)
        console.error("No response received from server:", error.request);
        Swal.fire('Error', 'No response received from the server. Please try again later.', 'error');
      } else {
        // Something happened while setting up the request
        console.error("Error setting up the request:", error.message);
        Swal.fire('Error', 'An unexpected error occurred: ' + error.message, 'error');
      }
    });
  };
  
  

  return (
    <div className="registration-container">
      {/* Left side with image */}
      <div className="image-container">
        <img src="https://www.eylulveterinerlik.com/upload/galeri/boluveteriner.jpg" alt="Dog and Cat" />
      </div>

      {/* Right side with form */}
      <div className="form-container">
        <strong><h2 className="text-center mb-4">Customer Registration </h2></strong>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label>Username:</label>
            <input type="text" className="form-control" name="username" value={formData.username} onChange={handleChange} required />
          </div>
          <div className="form-group mb-3">
            <label>Email:</label>
            <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group mb-3">
            <label>National ID:</label>
            <input type="text" className="form-control" name="nic" value={formData.nic} onChange={handleChange} required />
          </div>
          <div className="form-group mb-3">
            <label>Address:</label>
            <input type="text" className="form-control" name="address" value={formData.address} onChange={handleChange} required />
          </div>
          <div className="form-group mb-3">
            <label>Phone Number:</label>
            <input type="text" className="form-control" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
          </div>
          <div className="form-group mb-3">
            <label>Password:</label>
            <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-success w-100">Register</button>
        </form>
        <p className="text-center mt-3">
          Already have an account? <a href="/login">Login</a>
        </p>
        <p className="text-center mt-3">
          Are you <strong>Staff member</strong> ? <a href="/staff-register">Register</a>
        </p>
        <p className="text-center mt-3">
          Are you <strong>Doctor</strong> ? <a href="/doctor-register">Register</a>
        </p>
        <p className="text-center mt-3">
          Are you <strong>Service Provider</strong> ? <a href="/service-provider-register">Register</a>
        </p>
      </div>
    </div>
  );
};

export default Registration;
