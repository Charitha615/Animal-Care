// ServiceProviderDetails.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavBar from './AdminNavBar';
import './doctordetails.css';

const ServiceProviderDetails = () => {
    const [serviceProviders, setServiceProviders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch service providers data from API
        fetch('http://localhost/animal_care_api/Service_Provider/get_all_service_providers.php')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    setServiceProviders(data.data);
                }
            })
            .catch(error => console.error('Error fetching service provider data:', error));
    }, []);

    const handleRegisterServiceProvider = () => {
        navigate('/service-provider-register');
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
                    <h3>List of Provider Members</h3>
                    
                    <button className="register-staff-btn" onClick={handleRegisterServiceProvider}>
                        Register New Service Provider
                    </button>

                    {/* Table for displaying service providers */}
                    <table className="service-providers-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Service Center Name</th>
                                <th>Owner Name</th>
                                <th>Location</th>
                                <th>Phone Number</th>
                                <th>Email</th>
                                <th>NIC</th>
                                <th>Service Types</th>
                            </tr>
                        </thead>
                        <tbody>
                            {serviceProviders.map((provider) => (
                                <tr key={provider.id}>
                                    <td>{provider.id}</td>
                                    <td>{provider.service_center_name}</td>
                                    <td>{provider.owner_name}</td>
                                    <td>{provider.location}</td>
                                    <td>{provider.phone_no}</td>
                                    <td>{provider.email}</td>
                                    <td>{provider.nic}</td>
                                    <td>{provider.service_types.join(', ')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </main>
        </div>
    );
};

export default ServiceProviderDetails;
