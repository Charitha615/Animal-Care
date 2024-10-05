import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Login.css';
import config from '../../config';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    user_type: ''  // Add user_type to the state
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.user_type) {
      Swal.fire('Error', 'Please select a user type.', 'error');
      return;
    }

    axios.post(`${config.API_BASE_URL}/login.php`, {
      action: 'login',
      email: formData.email,
      password: formData.password,
      user_type: formData.user_type  // Send the selected user_type to the API
    })
      .then((response) => {
        console.log("Response:", response);

        if (response.data.status === 'success') {
          Swal.fire('Success', 'Login successful', 'success');

          const { user } = response.data;

          localStorage.setItem('UserID', user.id);

          // Redirect based on user_type
          if (user.user_type === 'staff') {
            setTimeout(() => {
              window.location.href = "/staff-dashboard";
            }, 2500);

          } else if (user.user_type === 'customer') {

            setTimeout(() => {
              window.location.href = "/";
            }, 2500);
          } else if (user.user_type === 'doctor') {
            localStorage.setItem('DoctorID', user.id);
            setTimeout(() => {
              window.location.href = "/doctor-dashboard";
            }, 2500);

          } else if (user.user_type === 'service_provider') {
            setTimeout(() => {
              window.location.href = "/service-provider-dashboard";
            }, 2500);

          }
        } else {
          Swal.fire('Error', response.data.message || 'Invalid email or password', 'error');
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
    <div className="login-container">
      {/* Left side with image */}
      <div className="image-container">
        <img src="https://www.eylulveterinerlik.com/upload/galeri/boluveteriner.jpg" alt="Dog and Cat" />
      </div>

      {/* Right side with form */}
      <div className="form-container">
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
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

          {/* Dropdown for selecting user type */}
          <div className="form-group mb-3">
            <label>User Type:</label>
            <select
              className="form-control"
              name="user_type"
              value={formData.user_type}
              onChange={handleChange}
              required
            >
              <option value="">Select User Type</option>
              <option value="customer">Customer</option>
              <option value="doctor">Doctor</option>
              <option value="service_provider">Service Provider</option>
              <option value="staff">Staff</option>
            </select>
          </div>

          <button type="submit" className="btn btn-success w-100">Login</button>
        </form>
        <p className="text-center mt-3">
          Don't have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
