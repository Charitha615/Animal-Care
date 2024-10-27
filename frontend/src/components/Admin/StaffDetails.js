import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavBar from './AdminNavBar';
import './staff.css';

const StaffDetails = () => {
    const navigate = useNavigate();
    const [doctorCount, setDoctorCount] = useState(0);
    const [serviceProviderCount, setServiceProviderCount] = useState(0);
    const [doctors, setDoctors] = useState([]); // to hold doctor details
    const [serviceProviders, setServiceProviders] = useState([]); // to hold service provider details

    useEffect(() => {
        // Fetch doctor count and details
        fetch('http://localhost/animal_care_api/Doctor/GetAllDoctors.php')
            .then(response => response.json())
            .then(data => {
                setDoctorCount(data.doctors.length);
                setDoctors(data.doctors); // assuming data.doctors is an array of doctor objects
            })
            .catch(error => console.error('Error fetching doctor data:', error));

        // Fetch service provider count and details
        fetch('http://localhost/animal_care_api/Service_Provider/get_all_service_providers.php')
            .then(response => response.json())
            .then(data => {
                setServiceProviderCount(data.data.length);
                setServiceProviders(data.data); // assuming data.data is an array of service provider objects
            })
            .catch(error => console.error('Error fetching service provider data:', error));
    }, []);

    const handleRegisterStaff = () => {
        navigate('/staff-register');
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
                    <h3>List of Staff Members</h3>
                    <div className="counts-container">
                        <div className="count-card">
                            <h4>Doctors</h4>
                            <p className="count-number">{doctorCount}</p>
                        </div>
                        <div className="count-card">
                            <h4>Service Providers</h4>
                            <p className="count-number">{serviceProviderCount}</p>
                        </div>
                    </div>

                    {/* <button className="register-staff-btn" onClick={handleRegisterStaff}>
                        Register New Staff
                    </button> */}
                </section>

                {/* Card list for doctors */}
                <section className="staff-list">
                    <h4>Doctors</h4>
                    <div className="card-container">
                        {doctors.map((doctor, index) => (
                            <div className="staff-card" key={index}>
                                <img src={`http://localhost/animal_care_api/Doctor/${doctor.profile_image}`}  className="staff-image" />
                                <h5 className="staff-name">{doctor.full_name}</h5>
                                <p className="staff-role">Doctor</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Card list for service providers */}
                <section className="staff-list">
                    <h4>Service Providers</h4>
                    <div className="card-container">
                        {serviceProviders.map((provider, index) => (
                            <div className="staff-card" key={index}>
                                <img src={`http://localhost/animal_care_api/Service_Provider/${provider.image}`} className="staff-image" />
                                <h5 className="staff-name">{provider.owner_name}</h5>
                                <p className="staff-role">Service Provider</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default StaffDetails;
