// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Registration from './components/Customer/Registration';
import Login from './components/Customer/Login';
import StaffRegistration from './components/Staff/StaffRegistration';
import StaffDashboard from './components/Staff/StaffDashboard';
import CustomerDashboard from './components/Customer/CustomerDashboard';
import Home from './components/Customer/Home.js';
import EmergencyAppointment from './components/Services/EmergencyAppointment.js';
import Appointment from './components/Services/Appointment.js';
import BookAppointmentForm from './components/Services/BookAppointmentForm.js';
import DoctorRegistration from './components/Doctor/DoctorRegistration.js';
import ServiceProviderRegistration from './components/ServiceProvider/ServiceProviderRegistration.js';
import DoctorDashboard from './components/Doctor/DoctorDashboard.js';
import DoctorProfileManagement from './components/Doctor/DoctorProfileManagement.js';
import DoctorAppointments from './components/Doctor/DoctorAppointments.js';
import DoctorEmergencyAppointments from './components/Doctor/DoctorEmergencyAppointments.js';
import MyAppointments from './components/Customer/myAppoinment.js';






function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/staff-register" element={<StaffRegistration />} />
          <Route path="/staff-dashboard" element={<StaffDashboard />} />
          <Route path="/customer-dashboard" element={<CustomerDashboard />} />
          {/* <Route path="/" element={<Login />} /> */}
          <Route path="/" element={<Home />} />



          <Route path="/emergencyappointment" element={<EmergencyAppointment />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/book-appointment/:serviceProviderId" element={<BookAppointmentForm />} />

          <Route path="/doctor-register" element={<DoctorRegistration />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/profile" element={<DoctorProfileManagement />} />
          <Route path="/doctor/appointments" element={<DoctorAppointments />} />
          <Route path="/doctor/emergency" element={<DoctorEmergencyAppointments />} />

          <Route path="/my-appointments" element={<MyAppointments />} />



          <Route path="/service-provider-register" element={<ServiceProviderRegistration />} />


        </Routes>
      </div>
    </Router>
  );
}

export default App;