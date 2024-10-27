// AdminNavBar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaUsers, FaBell, FaHome } from 'react-icons/fa'; // Import icons from Font Awesome or similar
import logo from '../../assets/logo.jpg'; // Adjust the path as necessary
import './AdminNavBar.css'; // Create a CSS file for custom styling

const AdminNavBar = () => {
    return (
        <aside className="sidebar">
            <div className="logo">

                <h1>Animal Care</h1>
            </div>

            <div>                <img src={logo} alt="Animal Care Logo" className="logo-image" /></div>
            <ul className="menu">
                <li className="menu-item">
                    <Link to="/adminDashboard">
                        <FaHome className="icon" /> Dashboard
                    </Link>
                </li>
                <li className="menu-item">
                    <Link to="/staffDetails">
                        <FaUsers className="icon" /> Staff Management
                    </Link>
                </li>
                <li className="menu-item">
                    <Link to="/doctorDetails">
                        <FaUsers className="icon" /> Doctor Details
                    </Link>
                </li>

                <li className="menu-item">
                    <Link to="/serviceProviderDetails">
                        <FaUsers className="icon" /> Service Provider
                    </Link>
                </li>
                <li className="menu-item">
                    <Link to="/customerDetails">
                        <FaUser className="icon" /> Customers Details
                    </Link>
                </li>
                <li className="menu-item">
                    <Link to="/admin-dashboard/notifications">
                        <FaBell className="icon" /> Notification
                    </Link>
                </li>
            </ul>
        </aside>
    );
};

export default AdminNavBar;
