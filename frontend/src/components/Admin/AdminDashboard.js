import React from 'react';
import './AdminDashboard.css'; // Add this CSS file to style the components
import AdminNavBar from './AdminNavBar'; // Import the AdminNavBar component

const AdminDashboard = () => {
    return (
        <div className="admin-dashboard">
            {/* Use the AdminNavBar component here */}
            <AdminNavBar />

            <main className="main-content">
                <header className="header">
                    <button className="logout-btn">Logout</button>
                    <button className="profile-btn">Profile</button>
                </header>

                <section className="dashboard-content">
                    <div className="dashboard-cards">
                        <div className="card">
                            <h3>5 Messages</h3>
                            <p>Inquiry</p>
                        </div>
                        <div className="card">
                            <h3>3 Notifications</h3>
                            <p>Feedback</p>
                        </div>
                    </div>

                    <div className="appointments">
                        <h3>Emergency Appointments</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Pet Type</th>
                                    <th>Mobile Number</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>Dog</td>
                                    <td>074589756</td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>Cat</td>
                                    <td>0765894656</td>
                                </tr>
                                <tr>
                                    <td>3</td>
                                    <td>Fish</td>
                                    <td>07854608854</td>
                                </tr>
                                <tr>
                                    <td>4</td>
                                    <td>Bird</td>
                                    <td>0745898754</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AdminDashboard;
