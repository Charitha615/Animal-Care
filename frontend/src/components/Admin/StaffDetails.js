// StaffDetails.js
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate to handle navigation
import AdminNavBar from './AdminNavBar'; // Import the AdminNavBar

const StaffDetails = () => {
    const navigate = useNavigate(); // Create a navigate function to handle routing

    const handleRegisterStaff = () => {
        navigate('/staff-register'); // Navigate to the staff registration page when clicked
    };

    return (
        <div className="admin-dashboard">
            <AdminNavBar /> {/* Admin navigation bar */}
            <main className="main-content">
                <header className="header">
                    <button
                        className="logout-btn"
                        onClick={() => {
                            // Clear all local storage items
                            localStorage.clear();

                            // Redirect to the home page
                            window.location.href = "/";
                        }}
                    >
                        Logout
                    </button>

                    <button className="profile-btn">Profile</button>
                </header>


                <section className="dashboard-content">
                    <h3>List of Staff Members</h3>


                    <button className="register-staff-btn" onClick={handleRegisterStaff}>
                        Register New Staff
                    </button>
                </section>
            </main>
        </div>
    );
};

export default StaffDetails;
