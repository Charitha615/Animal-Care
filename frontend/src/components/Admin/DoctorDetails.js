// StaffDetails.js
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate to handle navigation
import AdminNavBar from './AdminNavBar'; // Import the AdminNavBar

const StaffDetails = () => {
    const navigate = useNavigate(); // Create a navigate function to handle routing

    const handleRegisterStaff = () => {
        navigate('/doctor-register'); // Navigate to the staff registration page when clicked
    };

    return (
        <div className="admin-dashboard">
            <AdminNavBar /> {/* Admin navigation bar */}
            <main className="main-content">
                <header className="header">
                    <h2>Doctor Details</h2>
                    <button className="logout-btn">Logout</button>
                    <button className="profile-btn">Profile</button>
                </header>

                <section className="dashboard-content">
                    <h3>List of Doctor Members</h3>
                   

                    <button className="register-staff-btn" onClick={handleRegisterStaff}>
                        Register New Doctor
                    </button>
                </section>
            </main>
        </div>
    );
};

export default StaffDetails;
