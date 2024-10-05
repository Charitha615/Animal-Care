import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Registration.css'; 
import config from '../../config';

const StaffRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_no: '',
    address: '',
    nic: '',
    age: '',
    password: '',
    service_id: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    axios.post(`${config.API_BASE_URL}/UserRegistrationLogin.php`, {
      action: 'register',
      name: formData.name,
      email: formData.email,
      phone_no: formData.phone_no,
      address: formData.address,
      nic: formData.nic,
      age: formData.age,
      password: formData.password,
      service_id: formData.service_id,
      user_type: "staff",
    })
    .then((response) => {
      console.log("res is", response);
  
      // Check if the request was successful
      if (response.data.status === 'success') {
        Swal.fire('Success', 'Staff registered successfully', 'success');
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
      <div className="image-container">
      <img src="https://www.eylulveterinerlik.com/upload/galeri/boluveteriner.jpg" alt="Dog and Cat" />
      </div>

      <div className="form-container">
        <strong><h2 className="text-center mb-4">Staff Registration</h2></strong>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label>Name:</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
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
            <label>Address:</label>
            <input
              type="text"
              className="form-control"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>National ID (NIC):</label>
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
            <label>Age:</label>
            <input
              type="number"
              className="form-control"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>Service ID:</label>
            <input
              type="text"
              className="form-control"
              name="service_id"
              value={formData.service_id}
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
          <button type="submit" className="btn btn-success w-100">Register</button>
        </form>
        <p className="text-center mt-3">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default StaffRegistration;
