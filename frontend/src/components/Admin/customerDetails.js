import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavBar from './AdminNavBar';
import './doctordetails.css';

const CustomerDetails = () => {
    const [customers, setCustomers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch customer data from API
        fetch('http://localhost/animal_care_api/Customer/getAllCustomer.php')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    setCustomers(data.data); // Adjust based on response structure
                }
            })
            .catch(error => console.error('Error fetching customer data:', error));
    }, []);

    const handleRegisterCustomer = () => {
        navigate('/customer-register');
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
                    <h3>List of Customer Members</h3>
                   

                    {/* Table for displaying customers */}
                    <table className="doctors-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NIC</th>
                                <th>Customer Name</th>
                                <th>Address</th>
                                <th>Phone Number</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((customer) => (
                                <tr key={customer.id}>
                                    <td>{customer.id}</td>
                                    <td>{customer.nic}</td>
                                    <td>{customer.customer_name}</td>
                                    <td>{customer.address}</td>
                                    <td>{customer.phone_no}</td>
                                    <td>{customer.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </main>
        </div>
    );
};

export default CustomerDetails;
