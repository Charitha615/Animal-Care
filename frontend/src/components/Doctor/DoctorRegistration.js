import React, { useState } from 'react';
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
    qualifications: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post(`${config.API_BASE_URL}/Doctor/DoctorfRegistrationLogin.php`, {
      action: 'register',
      email: formData.email,
      password: formData.password,
      full_name: formData.full_name,
      gender: formData.gender,
      date_of_birth: formData.date_of_birth,
      phone_number: formData.phone_number,
      medical_license_number: formData.medical_license_number,
      specialization: formData.specialization,
      years_of_experience: parseInt(formData.years_of_experience, 10),
      qualifications: formData.qualifications,
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
      <img src="https://www.eylulveterinerlik.com/upload/galeri/boluveteriner.jpg" alt="Dog and Cat" />
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
