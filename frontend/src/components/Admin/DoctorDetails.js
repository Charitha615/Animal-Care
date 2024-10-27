import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavBar from './AdminNavBar';
import './doctordetails.css';

const DoctorDetails = () => {
    const [doctors, setDoctors] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch doctors data from API
        fetch('http://localhost/animal_care_api/Doctor/GetAllDoctors.php')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    setDoctors(data.doctors);
                }
            })
            .catch(error => console.error('Error fetching doctor data:', error));
    }, []);

    const handleRegisterStaff = () => {
        navigate('/doctor-register');
    };

    return (
        <div className="admin-dashboard">
            <AdminNavBar />
            <main className="main-content">
                <header className="header">
                    <button
                        className="logout-btn"
                        onClick={() => {
                            localStorage.clear();
                            window.location.href = "/";
                        }}
                    >
                        Logout
                    </button>
                    <button className="profile-btn">Profile</button>
                </header>

                <section className="dashboard-content">
                    <h3>List of Doctor Members</h3>

                    <button className="register-staff-btn" onClick={handleRegisterStaff}>
                        Register New Doctor
                    </button>


                    {/* Table for displaying doctors */}
                    <table className="doctors-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Email</th>
                                <th>Full Name</th>
                                <th>Gender</th>
                                <th>Date of Birth</th>
                                <th>Phone Number</th>
                                <th>Specialization</th>
                                <th>Experience (years)</th>
                                <th>Available Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doctors.map((doctor) => (
                                <tr key={doctor.id}>
                                    <td>{doctor.id}</td>
                                    <td>{doctor.email}</td>
                                    <td>{doctor.full_name}</td>
                                    <td>{doctor.gender}</td>
                                    <td>{doctor.date_of_birth}</td>
                                    <td>{doctor.phone_number}</td>
                                    <td>{doctor.specialization}</td>
                                    <td>{doctor.years_of_experience}</td>
                                    <td>{doctor.available_start_time} - {doctor.available_end_time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </main>
        </div>
    );
};

export default DoctorDetails;
